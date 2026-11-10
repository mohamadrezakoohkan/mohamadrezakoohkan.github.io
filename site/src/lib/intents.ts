// Loads every .intent file the site publishes and turns it into a page.
// Older versions of a file are read back from git history, so each one
// keeps a permanent URL (/posts/launch/v1) without a copy in the repo.
import { execFileSync } from "node:child_process";
import { relative, resolve } from "node:path";
import { parse, resultFor, type Eval, type IntentFile, type Status } from "@intent/tool/parse";
import { marked } from "marked";

const content = import.meta.glob<string>("../../content/**/*.intent", {
  query: "?raw",
  import: "default",
  eager: true,
});
const spec = import.meta.glob<string>("../../../spec/*.intent", {
  query: "?raw",
  import: "default",
  eager: true,
});

export interface EvalView {
  eval: Eval;
  status: Status;
  note: string;
}

export interface IntentPage {
  /** Page URL, e.g. "/posts/launch" or "/posts/launch/v1". */
  url: string;
  /** Raw twin URL, e.g. "/posts/launch.intent". */
  sourceUrl: string;
  file: IntentFile;
  /** Headline: the title if the file has one, otherwise the goal. */
  headline: string;
  headlineHtml: string;
  goalHtml: string;
  bodyHtml: string;
  evals: EvalView[];
  /** The version this one supersedes, if it is published. */
  previous?: { url: string; version: number };
  /** Set on old versions: where the current version lives. */
  supersededBy?: { url: string; version: number };
}

// ── Git history ───────────────────────────────────────────────
function git(args: string[], cwd: string): string {
  return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
}

let root: string | null | undefined;
function repoRoot(): string | null {
  if (root === undefined) {
    try {
      root = git(["rev-parse", "--show-toplevel"], process.cwd()).trim();
    } catch {
      root = null;
    }
  }
  return root;
}

/** The last committed text of every version older than `current`. */
function olderVersions(globPath: string, current: number): IntentFile[] {
  const top = repoRoot();
  if (!top) return [];
  // The site builds from site/, and glob paths are relative to src/lib.
  const rel = relative(top, resolve(process.cwd(), "src/lib", globPath));
  let shas: string[];
  try {
    shas = git(["log", "--format=%H", "--", rel], top).split("\n").filter(Boolean);
  } catch {
    return [];
  }
  const found = new Map<number, IntentFile>();
  for (const sha of shas) {
    try {
      const old = parse(git(["show", `${sha}:${rel}`], top));
      if (old.version < current && !found.has(old.version)) found.set(old.version, old);
    } catch {
      // unparseable or missing at that commit: skip
    }
  }
  return [...found.values()].sort((a, b) => a.version - b.version);
}

// ── Pages ─────────────────────────────────────────────────────
function evalViews(file: IntentFile, archived: boolean): EvalView[] {
  return file.evals.map((e): EvalView => {
    if (e.kind === "test") {
      // A failing test blocks the deploy, so any published page passed its tests.
      return {
        eval: e,
        status: "pass",
        note: archived ? `passed while v${file.version} was live` : "checked on every deploy",
      };
    }
    const recorded = resultFor(file, e);
    if (recorded) {
      const when = recorded.date ? `${recorded.date}: ` : "";
      return { eval: e, status: recorded.status, note: `${when}${recorded.reason}`.trim() || "recorded" };
    }
    const note =
      e.kind === "judge" ? "pending: needs an AI-assisted computer"
      : e.kind === "review" ? "pending: waiting for my sign-off"
      : "not measured yet; never blocks";
    return { eval: e, status: "pending", note };
  });
}

/** Gives h2/h3 headings ids ("The lock" → #the-lock) so they can be linked. */
function withHeadingIds(html: string): string {
  return html.replace(/<h([23])>(.*?)<\/h\1>/g, (_, level: string, inner: string) => {
    const id = inner
      .replace(/<[^>]+>/g, "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-|-$/g, "");
    return `<h${level} id="${id}">${inner}</h${level}>`;
  });
}

function render(file: IntentFile, url: string, sourceUrl: string, archived: boolean): IntentPage {
  const headline = file.title ?? file.goal;
  return {
    url,
    sourceUrl,
    file,
    headline,
    headlineHtml: marked.parseInline(headline, { async: false }),
    goalHtml: marked.parseInline(file.goal, { async: false }),
    bodyHtml: withHeadingIds(marked.parse(file.fulfillment, { async: false })),
    evals: evalViews(file, archived),
  };
}

function load(globPath: string, raw: string): IntentPage[] {
  let file: IntentFile;
  try {
    file = parse(raw);
  } catch (err) {
    throw new Error(`${globPath}: ${(err as Error).message}`);
  }

  let url: string;
  if (globPath.includes("/spec/")) {
    url = `/${globPath.split("/spec/")[1].replace(/\.intent$/, "")}`;
  } else {
    const rel = globPath.split("/content/")[1].replace(/\.intent$/, "");
    url = rel === "index" ? "/" : `/${rel}`;
  }
  const base = url === "/" ? "" : url;
  const current = render(file, url, url === "/" ? "/index.intent" : `${url}.intent`, false);

  const old = olderVersions(globPath, file.version).map((f) => {
    const page = render(f, `${base}/v${f.version}`, `${base}/v${f.version}.intent`, true);
    page.supersededBy = { url, version: file.version };
    return page;
  });
  old.forEach((page, i) => {
    const prev = old[i - 1];
    if (prev) page.previous = { url: prev.url, version: prev.file.version };
  });
  const last = old[old.length - 1];
  if (last) current.previous = { url: last.url, version: last.file.version };

  return [current, ...old];
}

const pages: IntentPage[] = [
  ...Object.entries(content).flatMap(([p, raw]) => load(p, raw)),
  ...Object.entries(spec).flatMap(([p, raw]) => load(p, raw)),
];

export function getPage(url: string): IntentPage {
  const page = pages.find((p) => p.url === url);
  if (!page) throw new Error(`no .intent file for ${url}`);
  return page;
}

/** Current versions of posts, for the homepage and post routes. */
export function getPosts(): IntentPage[] {
  return pages
    .filter((p) => p.url.startsWith("/posts/") && !p.supersededBy)
    .sort((a, b) => (b.file.meta.date ?? "").localeCompare(a.file.meta.date ?? "") || a.url.localeCompare(b.url));
}

/** Superseded versions of posts, each at /posts/<slug>/v<n>. */
export function getOldPosts(): IntentPage[] {
  return pages.filter((p) => p.url.startsWith("/posts/") && p.supersededBy);
}

/** Superseded versions of the homepage, each at /v<n>. */
export function getOldHome(): IntentPage[] {
  return pages.filter((p) => p.supersededBy?.url === "/");
}

export const STATUS_MARK: Record<Status, string> = { pass: "✓", fail: "✗", pending: "○" };

export function summary(page: IntentPage): string {
  const pending = page.evals.filter((e) => e.status === "pending").length;
  const passed = page.evals.filter((e) => e.status === "pass").length;
  return `v${page.file.version} · ${passed} ✓ · ${pending} ○`;
}
