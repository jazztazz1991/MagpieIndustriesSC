# Mining Locations — Add Pyro/Nyx + FPS Mining

## Summary

Mining locations generator currently only covers Stanton ship mining (23 locations). Need to add Pyro, Nyx, and FPS/ground mining data.

## Part 1: Add Pyro & Nyx (Quick)

The generator is hardcoded to `systems = ["stanton"]`. Pyro has 11 HPP files + asteroid fields, Nyx has asteroid fields.

- Change `systems` array to `["stanton", "pyro", "nyx"]`
- Add location metadata for Pyro/Nyx bodies (names, type, parent, gravity, atmosphere, danger)
- Pyro bodies: Pyro I-VI + moons (5a-5f), asteroid fields
- Nyx bodies: asteroid fields, Delamar

## Part 2: FPS Mining Locations (New Data Chain)

FPS harvestables use a different path than ship mining:
- Ship mining: `harvestablepresets/mining_*.xml` → HPP provider presets per planet
- FPS mining: `harvestablepresets/fpsmining_*.xml` → slot presets (cave/ground configs) → referenced by level/biome

The FPS chain is: slot presets define which FPS ores spawn in which biome types (sand caves, rock caves, acidic caves, etc.), and those slot presets are used by the game's level system to populate caves on specific moons.

From our Carinite investigation:
- FPS presets: `fpsmining_carinite.xml`, `fpsmining_hadanite.xml`, etc.
- Ground vehicle: `groundvehiclemining_*.xml`
- Slot presets: `slotpresets/caves/loot_caves_unoccupied_sand_stanton.xml` etc.
- Biome types: sand, rock, acidic — per system (stanton, pyro)

Approach: Parse slot preset files to build a map of which FPS ores appear in which biome/system combination. Then map biome types to known moon surfaces.

## Files to Modify

- `scripts/generators/mining-locations.ts` — Add systems, add FPS parsing
- `data/overrides/names.json` — Add Pyro/Nyx location name mappings

## Checklist

- [ ] Add Pyro and Nyx to systems array with location metadata
- [ ] Add Pyro/Nyx ore name mappings to overrides
- [ ] Parse FPS mining presets (fpsmining_*.xml) → build UUID map
- [ ] Parse cave/ground slot presets → map FPS ores to biome types
- [ ] Map biome types to moons/planets
- [ ] Add FPS ores to location output (separate field or merged)
- [ ] Regenerate and verify in data viewer
- [ ] Run all tests
