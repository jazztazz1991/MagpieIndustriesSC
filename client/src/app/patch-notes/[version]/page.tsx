import Link from "next/link";
import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { isValidVersion } from "@/domain/patchNotes";
import shared from "../../tools/tools.module.css";
import styles from "../patch-notes.module.css";

interface PageProps {
  params: Promise<{ version: string }>;
}

export default async function PatchNoteDetailPage({ params }: PageProps) {
  const { version } = await params;

  // Guard against path traversal — only digits and dots allowed
  if (!isValidVersion(version)) notFound();

  const filePath = path.join(process.cwd(), "src", "data", "patch-notes", `${version}.md`);
  if (!fs.existsSync(filePath)) notFound();

  const content = fs.readFileSync(filePath, "utf-8");

  return (
    <div className={shared.page}>
      <Link href="/patch-notes" style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "block", marginBottom: "1rem" }}>
        ← All Patch Notes
      </Link>
      <div className={shared.panel}>
        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
          Version {version}
        </div>
        <div className={styles.markdown}>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
