"use client";

import React from "react";
import styles from "./guides.module.css";

interface MarkdownHelpModalProps {
  onClose: () => void;
}

export default function MarkdownHelpModal({ onClose }: MarkdownHelpModalProps) {
  return (
    <div className={styles.mdHelpOverlay} onClick={onClose}>
      <div className={styles.mdHelpModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.mdHelpHeader}>
          <h3 className={styles.mdHelpTitle}>Markdown Guide</h3>
          <button className={styles.mdHelpClose} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className={styles.mdHelpBody}>
          <table className={styles.mdHelpTable}>
            <thead>
              <tr>
                <th>You type</th>
                <th>You get</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code># Heading 1</code></td>
                <td><strong>Large heading</strong></td>
              </tr>
              <tr>
                <td><code>## Heading 2</code></td>
                <td><strong>Medium heading</strong></td>
              </tr>
              <tr>
                <td><code>### Heading 3</code></td>
                <td><strong>Small heading</strong></td>
              </tr>
              <tr>
                <td><code>**bold text**</code></td>
                <td><strong>bold text</strong></td>
              </tr>
              <tr>
                <td><code>*italic text*</code></td>
                <td><em>italic text</em></td>
              </tr>
              <tr>
                <td><code>~~strikethrough~~</code></td>
                <td><s>strikethrough</s></td>
              </tr>
              <tr>
                <td><code>[Link text](url)</code></td>
                <td><span className={styles.mdHelpLink}>Link text</span></td>
              </tr>
              <tr>
                <td><code>- Item 1</code><br /><code>- Item 2</code></td>
                <td>Bulleted list</td>
              </tr>
              <tr>
                <td><code>1. First</code><br /><code>2. Second</code></td>
                <td>Numbered list</td>
              </tr>
              <tr>
                <td><code>`inline code`</code></td>
                <td><code>inline code</code></td>
              </tr>
              <tr>
                <td><code>```</code><br />code block<br /><code>```</code></td>
                <td>Code block</td>
              </tr>
              <tr>
                <td><code>&gt; Quote text</code></td>
                <td>Blockquote</td>
              </tr>
              <tr>
                <td><code>---</code></td>
                <td>Horizontal rule</td>
              </tr>
            </tbody>
          </table>
          <p className={styles.mdHelpNote}>
            Leave a blank line between paragraphs for spacing.
          </p>
        </div>
      </div>
    </div>
  );
}
