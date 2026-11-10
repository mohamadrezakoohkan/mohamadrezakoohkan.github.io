// Loads every .intent file the site publishes and turns it into a page.
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
  /** Page URL, e.g. "/posts/launch". */
  url: string;
  /** Raw twin URL, e.g. "/posts/launch.intent". */
  sourceUrl: string;
  file: IntentFile;
  goalHtml: string;
  bodyHtml: string;
  evals: EvalView[];
}

function toPage(globPath: string, raw: string): IntentPage {
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
  const sourceUrl = url === "/" ? "/index.intent" : `${url}.intent`;

  const evals = file.evals.map((e): EvalView => {
    if (e.kind === "test") {
      // A failing test blocks the deploy, so any published page passed its tests.
      return { eval: e, status: "pass", note: "checked on every deploy" };
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

  return {
    url,
    sourceUrl,
    file,
    goalHtml: marked.parseInline(file.goal, { async: false }),
    bodyHtml: marked.parse(file.fulfillment, { async: false }),
    evals,
  };
}

const pages: IntentPage[] = [
  ...Object.entries(content).map(([p, raw]) => toPage(p, raw)),
  ...Object.entries(spec).map(([p, raw]) => toPage(p, raw)),
];

export function getPage(url: string): IntentPage {
  const page = pages.find((p) => p.url === url);
  if (!page) throw new Error(`no .intent file for ${url}`);
  return page;
}

export function getPosts(): IntentPage[] {
  return pages
    .filter((p) => p.url.startsWith("/posts/"))
    .sort((a, b) => (b.file.meta.date ?? "").localeCompare(a.file.meta.date ?? "") || a.url.localeCompare(b.url));
}

export const STATUS_MARK: Record<Status, string> = { pass: "✓", fail: "✗", pending: "○" };

export function summary(page: IntentPage): string {
  const pending = page.evals.filter((e) => e.status === "pending").length;
  const passed = page.evals.filter((e) => e.status === "pass").length;
  return `v${page.file.version} · ${passed} ✓ · ${pending} ○`;
}
