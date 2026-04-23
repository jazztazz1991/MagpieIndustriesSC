#!/bin/bash
# Extract Star Citizen game data from Data.p4k using unp4k + unforge
# Produces XML files that the TypeScript generator reads
#
# Usage:
#   bash scripts/extract-gamedata.sh          # Full extraction + raw dump
#   bash scripts/extract-gamedata.sh --raw    # Only raw dump (skip unforge)

set -euo pipefail

# Load env
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

if [ -f "$ROOT_DIR/.env" ]; then
  set -a
  source "$ROOT_DIR/.env"
  set +a
fi

SC_INSTALL="${SC_INSTALL_PATH:-D:/StarCitizen/StarCitizen/LIVE}"
SC_EXTRACTED="${SC_EXTRACTED_PATH:-D:/StarCitizen/extracted}"
SC_TOOLS="${SC_TOOLS_PATH:-D:/StarCitizen/tools/unp4k-suite}"

P4K_FILE="$SC_INSTALL/Data.p4k"
UNP4K="$SC_TOOLS/unp4k.exe"
UNFORGE="$SC_TOOLS/unforge.exe"

PARSED_DIR="$SC_EXTRACTED/parsed"
RAW_DIR="$SC_EXTRACTED/raw"

# Validate tools exist
if [ ! -f "$UNP4K" ]; then
  echo "ERROR: unp4k.exe not found at $UNP4K"
  echo "Download from: https://github.com/dolkensp/unp4k/releases"
  exit 1
fi

if [ ! -f "$P4K_FILE" ]; then
  echo "ERROR: Data.p4k not found at $P4K_FILE"
  echo "Set SC_INSTALL_PATH in .env to your Star Citizen install directory"
  exit 1
fi

# Read SC version from build_manifest.id (JSON format)
# CIG doesn't always rewrite build_manifest.id on hotfixes, so we append a
# fingerprint derived from Data.p4k mtime to distinguish patches the manifest
# misses. Format: "<branch>-<version>[+hotfix-YYYYMMDD-HHMM]" — the suffix only
# appears when the P4K is newer than the manifest.
VERSION="unknown"
MANIFEST="$SC_INSTALL/build_manifest.id"
if [ -f "$MANIFEST" ]; then
  BASE_VERSION=$(node -e "const d=JSON.parse(require('fs').readFileSync('$MANIFEST','utf8'));console.log(d.Data.Branch+'-'+d.Data.Version)")
  MANIFEST_MTIME=$(stat -c %Y "$MANIFEST" 2>/dev/null || echo 0)
  P4K_MTIME=$(stat -c %Y "$P4K_FILE" 2>/dev/null || echo 0)
  # 60-second grace window to avoid flagging simultaneous writes
  if [ "$P4K_MTIME" -gt $(( MANIFEST_MTIME + 60 )) ]; then
    HOTFIX_TAG=$(date -d "@$P4K_MTIME" +%Y%m%d-%H%M 2>/dev/null || date +%Y%m%d-%H%M)
    VERSION="${BASE_VERSION}+hotfix-${HOTFIX_TAG}"
    echo "SC Version: $VERSION (P4K is newer than manifest — hotfix detected)"
  else
    VERSION="$BASE_VERSION"
    echo "SC Version: $VERSION"
  fi
else
  echo "WARNING: build_manifest.id not found, using 'unknown' as version"
fi

# Step 1: Extract Game2.dcb from p4k
echo ""
echo "=== Step 1: Extracting Game2.dcb from Data.p4k ==="
TEMP_EXTRACT="$SC_EXTRACTED/temp_extract"
mkdir -p "$TEMP_EXTRACT"

# unp4k may ignore -o and write to cwd, so cd into temp dir
ORIG_DIR="$(pwd)"
cd "$TEMP_EXTRACT"
"$UNP4K" "$P4K_FILE" "Data/Game2.dcb"
cd "$ORIG_DIR"

DCB_FILE="$TEMP_EXTRACT/Data/Game2.dcb"
if [ ! -f "$DCB_FILE" ]; then
  # Some unp4k versions flatten output — check without Data/ prefix
  if [ -f "$TEMP_EXTRACT/Game2.dcb" ]; then
    mkdir -p "$TEMP_EXTRACT/Data"
    mv "$TEMP_EXTRACT/Game2.dcb" "$TEMP_EXTRACT/Data/Game2.dcb"
  else
    echo "ERROR: Failed to extract Game2.dcb"
    echo "  Checked: $DCB_FILE"
    echo "  Also checked: $TEMP_EXTRACT/Game2.dcb"
    echo "  Contents of temp dir:"
    ls -la "$TEMP_EXTRACT"
    exit 1
  fi
fi
echo "Extracted Game2.dcb ($(du -h "$DCB_FILE" | cut -f1))"

# Step 1b: Extract localization file
echo ""
echo "=== Step 1b: Extracting localization from Data.p4k ==="
cd "$TEMP_EXTRACT"
"$UNP4K" "$P4K_FILE" "Data/Localization/english/global.ini" || true
cd "$ORIG_DIR"

LOC_FILE="$TEMP_EXTRACT/Data/Localization/english/global.ini"
if [ ! -f "$LOC_FILE" ]; then
  # Check flattened path
  ALT_LOC=$(find "$TEMP_EXTRACT" -iname "global.ini" 2>/dev/null | head -1)
  if [ -n "$ALT_LOC" ]; then
    LOC_FILE="$ALT_LOC"
  else
    echo "WARNING: global.ini not found, entity display names may be incomplete"
  fi
fi

if [ -f "$LOC_FILE" ]; then
  echo "Extracted global.ini ($(du -h "$LOC_FILE" | cut -f1))"
  # Copy to parsed dir for generators to use
  LOC_OUT_DIR="$PARSED_DIR/localization"
  mkdir -p "$LOC_OUT_DIR"
  cp "$LOC_FILE" "$LOC_OUT_DIR/global.ini"
  echo "Localization copied to $LOC_OUT_DIR/global.ini"
fi

# Step 2: Convert DCB to XML with unforge
echo ""
echo "=== Step 2: Converting Game2.dcb to XML with unforge ==="
PARSED_XML_DIR="$PARSED_DIR/xml"
mkdir -p "$PARSED_XML_DIR"

# unforge outputs XML files relative to the DCB location
cd "$TEMP_EXTRACT/Data"
"$UNFORGE" "Game2.dcb"

# Move the generated XML structure to parsed dir
if [ -d "$TEMP_EXTRACT/Data/libs" ]; then
  rm -rf "$PARSED_XML_DIR/libs"
  mv "$TEMP_EXTRACT/Data/libs" "$PARSED_XML_DIR/libs"
fi
if [ -f "$TEMP_EXTRACT/Data/Game2.xml" ]; then
  mv "$TEMP_EXTRACT/Data/Game2.xml" "$PARSED_XML_DIR/Game2.xml"
fi
echo "XML files written to $PARSED_XML_DIR"

# Step 3: Raw dump (versioned copy for patch diffing)
echo ""
echo "=== Step 3: Creating raw dump for version $VERSION ==="
RAW_VERSION_DIR="$RAW_DIR/$VERSION"
if [ -d "$RAW_VERSION_DIR" ]; then
  echo "Raw dump for $VERSION already exists, skipping (delete manually to re-extract)"
else
  mkdir -p "$RAW_VERSION_DIR"
  cp -r "$PARSED_XML_DIR/libs" "$RAW_VERSION_DIR/libs"
  echo "Raw dump saved to $RAW_VERSION_DIR"
fi

# Write version file
echo "$VERSION" > "$PARSED_DIR/version.txt"
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > "$PARSED_DIR/extracted_at.txt"

# Cleanup
rm -rf "$TEMP_EXTRACT"

echo ""
echo "=== Extraction complete ==="
echo "  Version:  $VERSION"
echo "  Parsed:   $PARSED_XML_DIR"
echo "  Raw dump: $RAW_VERSION_DIR"
echo ""
echo "Next: run 'npm run sync:generate' to produce TypeScript data files"
