import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { parse, resultFor, type Eval, type IntentFile, type Status } from "./parse.ts";

export interface Outcome {
  eval: Eval;
  status: Status;
  /** One line explaining the status. */
  detail: string;
  /** Output of a failed command, for the log. */
  output?: string;
  /** Whether this outcome stops a deploy. Only failures of test, judge and review block. */
  blocks: boolean;
}

export interface LockCheck {
  status: Status;
  detail: string;
}

export interface Report {
  path: string;
  file?: IntentFile;
  error?: string;
  lock?: LockCheck;
  outcomes: Outcome[];
  blocked: boolean;
}

export interface VerifyOptions {
  /** Git revision to compare against for the lock check. Empty to skip. */
  against?: string;
  /** Run test and watch commands. */
  runCommands?: boolean;
  /** Called before each command runs, for progress output. */
  onRun?: (e: Eval) => void;
}

function run(command: string, file: string) {
  const res = spawnSync("sh", ["-c", command], {
    cwd: dirname(file),
    env: { ...process.env, INTENT_FILE: file },
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    timeout: 10 * 60 * 1000,
  });
  const output = `${res.stdout ?? ""}${res.stderr ?? ""}`.trim();
  if (res.error) return { ok: false, output: String(res.error.message) };
  return { ok: res.status === 0, output, code: res.status };
}

const norm = (s: string) => s.replace(/\s+/g, " ").trim();

/**
 * The contract: within a version, the goal and evals never change.
 * Compares the file with its copy at a git revision.
 */
export function checkLock(path: string, file: IntentFile, against: string): LockCheck | undefined {
  if (!against || /^0+$/.test(against)) return undefined;
  let old: IntentFile;
  try {
    const top = execFileSync("git", ["rev-parse", "--show-toplevel"], { cwd: dirname(path), encoding: "utf8" }).trim();
    const rel = relative(top, path);
    const raw = execFileSync("git", ["show", `${against}:${rel}`], {
      cwd: top,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    old = parse(raw);
  } catch {
    return undefined; // new file, no git, or unknown revision: nothing to compare
  }

  const changed = norm(old.goal) !== norm(file.goal) || norm(old.evalsSource) !== norm(file.evalsSource);
  if (file.version === old.version) {
    if (changed) {
      return {
        status: "fail",
        detail: `goal or evals changed but version is still ${file.version}. Bump to version ${file.version + 1} with supersedes: ${file.name}@${file.version}`,
      };
    }
    return { status: "pass", detail: `goal and evals unchanged since ${against.slice(0, 12)}` };
  }
  if (file.version < old.version) {
    return { status: "fail", detail: `version went down from ${old.version} to ${file.version}` };
  }
  const expected = `${old.name}@${old.version}`;
  if (file.supersedes !== expected) {
    return { status: "fail", detail: `version ${file.version} must say supersedes: ${expected}` };
  }
  return { status: "pass", detail: `new version ${file.version} supersedes ${expected}` };
}

export function verify(pathArg: string, opts: VerifyOptions = {}): Report {
  const path = resolve(pathArg);
  let file: IntentFile;
  try {
    file = parse(readFileSync(path, "utf8"));
  } catch (err) {
    return { path, error: (err as Error).message, outcomes: [], blocked: true };
  }

  const outcomes: Outcome[] = file.evals.map((e) => {
    if (e.kind === "test" || (e.kind === "watch" && e.command)) {
      const blocks = e.kind === "test";
      if (opts.runCommands === false) {
        return { eval: e, status: "pending", detail: "not run", blocks: false };
      }
      opts.onRun?.(e);
      const res = run(e.command!, path);
      return res.ok
        ? { eval: e, status: "pass", detail: "passed", blocks: false }
        : { eval: e, status: "fail", detail: `exit code ${res.code ?? "?"}`, output: res.output, blocks };
    }

    if (e.kind === "watch") {
      return { eval: e, status: "pending", detail: "not measured yet", blocks: false };
    }

    const recorded = resultFor(file, e);
    if (!recorded || recorded.status === "pending") {
      const who = e.kind === "judge" ? "needs an AI-assisted computer" : "waiting for a person";
      return { eval: e, status: "pending", detail: recorded?.reason || who, blocks: false };
    }
    const when = recorded.date ? ` (${recorded.date})` : "";
    return {
      eval: e,
      status: recorded.status,
      detail: `${recorded.reason || "recorded"}${when}`,
      blocks: recorded.status === "fail",
    };
  });

  const lock = checkLock(path, file, opts.against ?? "HEAD");
  const blocked = outcomes.some((o) => o.blocks) || lock?.status === "fail";
  return { path, file, lock, outcomes, blocked };
}
