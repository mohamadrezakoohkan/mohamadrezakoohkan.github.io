// Parser for .intent files.
//
// A file is YAML-style front matter followed by top-level sections:
//   # Goal         one plain sentence, locked within a version
//   # Evals        test / judge / review / watch items, locked within a version
//   # Fulfillment  the work, free to edit
//   # Results      recorded verdicts, free to edit (optional)

export type EvalKind = "test" | "judge" | "review" | "watch";
export const EVAL_KINDS: readonly EvalKind[] = ["test", "judge", "review", "watch"];

export type Status = "pass" | "fail" | "pending";

export interface Eval {
  kind: EvalKind;
  /** 1-based position among evals of the same kind ("judge 2"). */
  index: number;
  /** What a reader sees. For a named test this is the name. */
  text: string;
  /** Shell command for tests (always) and watches (optional). */
  command?: string;
}

export interface Result {
  kind: EvalKind;
  index: number;
  status: Status;
  date?: string;
  reason: string;
}

export interface IntentFile {
  name: string;
  version: number;
  supersedes?: string;
  /** Optional headline for readers. Not locked; the goal is the contract. */
  title?: string;
  /** `sha256:<hex>` of goal and evals; see lock.ts. */
  lock?: string;
  meta: Record<string, string>;
  goal: string;
  evals: Eval[];
  /** Raw Evals section, used to check that evals stay locked. */
  evalsSource: string;
  fulfillment: string;
  results: Result[];
  raw: string;
}

export class IntentParseError extends Error {
  line?: number;
  constructor(message: string, line?: number) {
    super(line ? `line ${line}: ${message}` : message);
    this.name = "IntentParseError";
    this.line = line;
  }
}

const SECTION_ORDER = ["goal", "evals", "fulfillment", "results"] as const;
type SectionName = (typeof SECTION_ORDER)[number];

const STATUS_SYMBOLS: Record<string, Status> = { "✓": "pass", "✗": "fail", "○": "pending" };
export const STATUS_SYMBOL: Record<Status, string> = { pass: "✓", fail: "✗", pending: "○" };

interface Fence {
  char: string;
  length: number;
  info: string;
}

function openFence(line: string): Fence | null {
  const m = /^ {0,3}(`{3,}|~{3,})(.*)$/.exec(line);
  if (!m) return null;
  return { char: m[1][0], length: m[1].length, info: m[2].trim() };
}

function closesFence(line: string, fence: Fence): boolean {
  const m = /^ {0,3}(`{3,}|~{3,})\s*$/.exec(line);
  return !!m && m[1][0] === fence.char && m[1].length >= fence.length;
}

export function parse(raw: string): IntentFile {
  const text = raw.replace(/\r\n?/g, "\n");
  const lines = text.split("\n");

  // ── Front matter ────────────────────────────────────────────
  if (lines[0]?.trim() !== "---") {
    throw new IntentParseError("file must start with front matter (---)", 1);
  }
  const end = lines.indexOf("---", 1);
  if (end === -1) throw new IntentParseError("front matter is not closed with ---", 1);

  const meta: Record<string, string> = {};
  for (let i = 1; i < end; i++) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const m = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(line);
    if (!m) throw new IntentParseError(`expected "key: value" in front matter`, i + 1);
    meta[m[1]] = m[2].trim().replace(/^["'](.*)["']$/, "$1");
  }

  if (!meta.name) throw new IntentParseError("front matter needs a name");
  if (!/^[a-z0-9][a-z0-9._-]*$/.test(meta.name)) {
    throw new IntentParseError(`name "${meta.name}" must be lowercase letters, digits, ".", "_" or "-"`);
  }
  const version = Number(meta.version);
  if (!Number.isInteger(version) || version < 1) {
    throw new IntentParseError("front matter needs a version: a whole number, 1 or higher");
  }
  if (meta.lock && !/^sha256:[0-9a-f]{64}$/.test(meta.lock)) {
    throw new IntentParseError(`lock must look like sha256:<64 hex characters>`);
  }
  const supersedes = meta.supersedes || undefined;
  if (supersedes && !/^[a-z0-9][a-z0-9._-]*@\d+$/.test(supersedes)) {
    throw new IntentParseError(`supersedes "${supersedes}" must look like name@version`);
  }

  // ── Sections ────────────────────────────────────────────────
  const sections = new Map<SectionName, { start: number; lines: string[] }>();
  let current: SectionName | null = null;
  let fence: Fence | null = null;

  for (let i = end + 1; i < lines.length; i++) {
    const line = lines[i];
    if (fence) {
      if (closesFence(line, fence)) fence = null;
    } else {
      const f = openFence(line);
      if (f) {
        fence = f;
      } else {
        const h = /^# (.+?)\s*#*\s*$/.exec(line);
        if (h) {
          const name = h[1].trim().toLowerCase() as SectionName;
          if (!SECTION_ORDER.includes(name)) {
            throw new IntentParseError(
              `unknown section "# ${h[1].trim()}". Sections are Goal, Evals, Fulfillment and Results; use ## inside Fulfillment`,
              i + 1,
            );
          }
          if (sections.has(name)) throw new IntentParseError(`section "# ${h[1].trim()}" appears twice`, i + 1);
          const prevIndex = current ? SECTION_ORDER.indexOf(current) : -1;
          if (SECTION_ORDER.indexOf(name) < prevIndex) {
            throw new IntentParseError("sections must be in the order Goal, Evals, Fulfillment, Results", i + 1);
          }
          current = name;
          sections.set(name, { start: i + 2, lines: [] });
          continue;
        }
      }
    }
    if (!current) {
      if (line.trim()) throw new IntentParseError("text before the first section", i + 1);
      continue;
    }
    sections.get(current)!.lines.push(line);
  }

  for (const required of ["goal", "evals", "fulfillment"] as const) {
    if (!sections.has(required)) {
      throw new IntentParseError(`missing section "# ${required[0].toUpperCase()}${required.slice(1)}"`);
    }
  }

  const goalSec = sections.get("goal")!;
  const goal = goalSec.lines.join("\n").trim();
  if (!goal) throw new IntentParseError("Goal is empty", goalSec.start - 1);
  if (/\n\s*\n/.test(goal)) throw new IntentParseError("Goal must be one plain sentence, not several paragraphs", goalSec.start);

  const evalsSec = sections.get("evals")!;
  const evals = parseEvals(evalsSec.lines, evalsSec.start);
  if (evals.length === 0) throw new IntentParseError("Evals has no items", evalsSec.start - 1);

  const resultsSec = sections.get("results");
  const results = resultsSec ? parseResults(resultsSec.lines, resultsSec.start) : [];

  return {
    name: meta.name,
    version,
    supersedes,
    title: meta.title || undefined,
    lock: meta.lock || undefined,
    meta,
    goal: goal.replace(/\s*\n\s*/g, " "),
    evals,
    evalsSource: evalsSec.lines.join("\n").trim(),
    fulfillment: sections.get("fulfillment")!.lines.join("\n").trim(),
    results,
    raw: text,
  };
}

/** Groups "- item" lines with their indented continuation lines. */
function listItems(lines: string[], startLine: number, section: string) {
  const items: { first: string; rest: string[]; line: number }[] = [];
  const notes: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^- /.test(line)) {
      items.push({ first: line.slice(2), rest: [], line: startLine + i });
    } else if (/^\s+\S/.test(line) || !line.trim()) {
      if (items.length) items[items.length - 1].rest.push(line);
    } else if (section === "results") {
      notes.push(line);
    } else {
      throw new IntentParseError(`every line in ${section} must be a "- " item or indented under one`, startLine + i);
    }
  }
  return items;
}

function dedent(lines: string[]): string[] {
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
  const indents = lines.filter((l) => l.trim()).map((l) => /^\s*/.exec(l)![0].length);
  const min = indents.length ? Math.min(...indents) : 0;
  return lines.map((l) => l.slice(min));
}

const ARROW = /\s+(?:→|->)\s+/;

function parseEvals(lines: string[], startLine: number): Eval[] {
  const counts: Record<EvalKind, number> = { test: 0, judge: 0, review: 0, watch: 0 };
  return listItems(lines, startLine, "evals").map(({ first, rest, line }) => {
    const m = /^(\w+):\s*(.*)$/.exec(first);
    if (!m) throw new IntentParseError(`eval must start with test:, judge:, review: or watch:`, line);
    const kind = m[1] as EvalKind;
    if (!EVAL_KINDS.includes(kind)) {
      throw new IntentParseError(`unknown eval type "${m[1]}". Use test, judge, review or watch`, line);
    }
    let text = m[2].trim();
    let command: string | undefined;

    const body = dedent(rest);
    const fenceAt = body.findIndex((l) => openFence(l));
    if (fenceAt !== -1) {
      const f = openFence(body[fenceAt])!;
      const closeAt = body.findIndex((l, j) => j > fenceAt && closesFence(l, f));
      if (closeAt === -1) throw new IntentParseError("code block under this eval is not closed", line);
      command = body.slice(fenceAt + 1, closeAt).join("\n");
      const wrapped = body.slice(0, fenceAt).join(" ").trim();
      if (wrapped) text = `${text} ${wrapped}`;
    } else {
      const wrapped = body.join(" ").replace(/\s+/g, " ").trim();
      if (wrapped) text = `${text} ${wrapped}`;
    }

    if (!command && (kind === "test" || kind === "watch")) {
      const split = text.split(ARROW);
      if (split.length > 1) {
        text = split[0].trim();
        command = split.slice(1).join(" → ").trim();
      } else if (kind === "test") {
        command = text;
      }
    }

    if (!text) throw new IntentParseError(`${kind} eval is empty`, line);
    if (kind === "test" && !command?.trim()) throw new IntentParseError("test eval needs a command", line);
    if ((kind === "judge" || kind === "review") && command) {
      throw new IntentParseError(`${kind} evals are plain sentences, not commands`, line);
    }

    counts[kind] += 1;
    return { kind, index: counts[kind], text, command };
  });
}

function parseResults(lines: string[], startLine: number): Result[] {
  return listItems(lines, startLine, "results").map(({ first, rest, line }) => {
    const m = /^(\w+)\s+(\d+):\s*(✓|✗|○)\s*(.*)$/.exec(first);
    if (!m || !EVAL_KINDS.includes(m[1] as EvalKind)) {
      throw new IntentParseError(`result must look like "- judge 1: ✓ 2026-11-12 — reason"`, line);
    }
    let detail = m[4].trim();
    let date: string | undefined;
    const d = /^(\d{4}-\d{2}-\d{2})\s*(?:[—–:-]\s*)?(.*)$/.exec(detail);
    if (d) {
      date = d[1];
      detail = d[2];
    }
    const more = dedent(rest).join(" ").replace(/\s+/g, " ").trim();
    return {
      kind: m[1] as EvalKind,
      index: Number(m[2]),
      status: STATUS_SYMBOLS[m[3]],
      date,
      reason: [detail, more].filter(Boolean).join(" "),
    };
  });
}

/** Word count of the fulfillment, ignoring code blocks. */
export function words(file: IntentFile): number {
  let fence: Fence | null = null;
  let count = 0;
  for (const line of file.fulfillment.split("\n")) {
    if (fence) {
      if (closesFence(line, fence)) fence = null;
      continue;
    }
    const f = openFence(line);
    if (f) {
      fence = f;
      continue;
    }
    count += (line.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) ?? []).length;
  }
  return count;
}

/** Fenced ```intent blocks inside the fulfillment, e.g. examples in the spec. */
export function examples(file: IntentFile): string[] {
  const found: string[] = [];
  const lines = file.fulfillment.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const f = openFence(lines[i]);
    if (!f) continue;
    const close = lines.findIndex((l, j) => j > i && closesFence(l, f));
    if (close === -1) break;
    if (f.info.split(/\s+/)[0] === "intent") found.push(lines.slice(i + 1, close).join("\n"));
    i = close;
  }
  return found;
}

/** The recorded result for an eval, if any. */
export function resultFor(file: IntentFile, e: Eval): Result | undefined {
  return file.results.find((r) => r.kind === e.kind && r.index === e.index);
}
