// The lock: a SHA-256 hash of the goal and evals, stored in front matter as
// `lock: sha256:<hex>`. Any tool can recompute it, so a changed goal or eval
// is detectable from the file alone, without git.
import { createHash } from "node:crypto";
import type { IntentFile } from "./parse.ts";

const norm = (s: string) => s.replace(/\s+/g, " ").trim();

/** sha256 of: goal and evals, each trimmed with whitespace runs collapsed, joined by "\n". */
export function computeLock(file: IntentFile): string {
  const input = `${norm(file.goal)}\n${norm(file.evalsSource)}`;
  return `sha256:${createHash("sha256").update(input, "utf8").digest("hex")}`;
}

/** Sets front matter keys, replacing existing lines or adding them before the closing ---. */
export function setFrontMatter(raw: string, updates: Record<string, string>): string {
  const lines = raw.replace(/\r\n?/g, "\n").split("\n");
  const end = lines.indexOf("---", 1);
  if (lines[0] !== "---" || end === -1) throw new Error("file has no front matter");
  const head = lines.slice(1, end);
  for (const [key, value] of Object.entries(updates)) {
    const at = head.findIndex((l) => l.startsWith(`${key}:`));
    if (at === -1) head.push(`${key}: ${value}`);
    else head[at] = `${key}: ${value}`;
  }
  return ["---", ...head, ...lines.slice(end)].join("\n");
}
