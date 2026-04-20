import Link from "next/link";
import fs from "fs";
import path from "path";
import { buildPatchNotesIndex } from "@/domain/patchNotes";
import shared from "../tools/tools.module.css";

export const metadata = {
  title: "Patch Notes — Magpie Industries SC",
  description: "Star Citizen patch notes extracted from DataForge changes.",
};

export default function PatchNotesIndexPage() {
  const dir = path.join(process.cwd(), "src", "data", "patch-notes");
  const filenames = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".md")) : [];
  const files = filenames.map((filename) => ({
    filename,
    content: fs.readFileSync(path.join(dir, filename), "utf-8"),
  }));
  const notes = buildPatchNotesIndex(files);

  return (
    <div className={shared.page}>
      <h1 className={shared.title}>Patch Notes</h1>
      <p className={shared.subtitle}>
        Star Citizen DataForge changes extracted per patch.
      </p>

      {notes.length === 0 ? (
        <div className={shared.emptyMessage}>No patch notes available yet.</div>
      ) : (
        <div className={shared.methodGrid}>
          {notes.map((note) => (
            <Link
              key={note.version}
              href={`/patch-notes/${note.version}`}
              className={shared.methodCard}
              style={{ textDecoration: "none", color: "inherit", display: "block" }}
            >
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.25rem" }}>
                Version {note.version}
              </div>
              <h3 style={{ margin: 0, fontSize: "1rem" }}>{note.title}</h3>
              <div style={{ marginTop: "0.75rem", fontSize: "0.8rem", color: "var(--accent)" }}>
                Read notes →
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
