#!/usr/bin/env -S node --experimental-strip-types --disable-warning=ExperimentalWarning
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { computeLock, setFrontMatter } from "./lock.ts";
import { examples, parse, STATUS_SYMBOL, words, type Status } from "./parse.ts";
import { committedFile, verify, type Report } from "./verify.ts";

const HELP = `intent: read and verify .intent files

Usage:
  intent verify [paths...] [--against <git-rev>] [--no-commands]
      Run tests and watches, read recorded judge and review verdicts,
      and check that goal and evals did not change within a version.
      Paths can be files or folders (default: current folder).
      Exits 1 if any test, judge or review failed (✗). Pending (○) never fails.
  intent lock [--bump] <files...>
      Write the lock hash of goal and evals into the front matter.
      A version that is already committed can't be re-locked with a
      different goal or evals: --bump raises the version, sets
      supersedes, and locks the new version.
  intent check <files...>       Parse only; report syntax errors.
  intent words <file>           Print the fulfillment's word count.
  intent examples <file>        Parse every \`\`\`intent example inside the fulfillment.
`;

const color = process.stdout.isTTY && !process.env.NO_COLOR;
const paint = (code: string, s: string) => (color ? `\x1b[${code}m${s}\x1b[0m` : s);
const STATUS_COLOR: Record<Status, string> = { pass: "32", fail: "31", pending: "90" };
const mark = (s: Status) => paint(STATUS_COLOR[s], STATUS_SYMBOL[s]);

const SKIP = new Set(["node_modules", "dist", ".git", ".astro"]);

function findIntentFiles(path: string): string[] {
  const st = statSync(path);
  if (st.isFile()) return [path];
  const out: string[] = [];
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    if (SKIP.has(entry.name) || (entry.isDirectory() && entry.name.startsWith("."))) continue;
    const full = join(path, entry.name);
    if (entry.isDirectory()) out.push(...findIntentFiles(full));
    else if (entry.name.endsWith(".intent")) out.push(full);
  }
  return out.sort();
}

function printReport(r: Report) {
  const rel = relative(process.cwd(), r.path) || r.path;
  if (r.error) {
    console.log(`${paint("1", rel)}\n  ${mark("fail")} ${r.error}\n`);
    return;
  }
  const f = r.file!;
  const head = [f.name, `v${f.version}`, f.supersedes ? `supersedes ${f.supersedes}` : ""].filter(Boolean).join(" · ");
  console.log(`${paint("1", rel)}  ${paint("90", head)}`);
  console.log(`  ${paint("3", f.goal)}`);
  for (const o of r.outcomes) {
    const kind = o.eval.kind.padEnd(6);
    const note = o.status === "pass" && o.eval.kind === "test" ? "" : paint("90", `  ${o.detail}`);
    console.log(`  ${mark(o.status)} ${kind} ${o.eval.text}${note}`);
    if (o.status === "fail" && o.output) {
      const tail = o.output.split("\n").slice(-15).map((l) => `      ${l}`).join("\n");
      console.log(paint("90", tail));
    }
  }
  if (r.hash) console.log(`  ${mark(r.hash.status)} hash   ${paint("90", r.hash.detail)}`);
  if (r.lock) console.log(`  ${mark(r.lock.status)} lock   ${paint("90", r.lock.detail)}`);

  const count = (kind: string, status: Status) =>
    r.outcomes.filter((o) => o.eval.kind === kind && o.status === status).length;
  const total = (kind: string) => r.outcomes.filter((o) => o.eval.kind === kind).length;
  const parts: string[] = [];
  if (total("test")) parts.push(`${count("test", "pass")}/${total("test")} tests pass`);
  for (const kind of ["judge", "review"]) {
    const n = total(kind);
    if (!n) continue;
    const p = count(kind, "pending");
    parts.push(`${count(kind, "pass")}/${n} ${kind}s pass${p ? ` (${p} pending)` : ""}`);
  }
  if (total("watch")) parts.push(`${total("watch")} watch${total("watch") > 1 ? "es" : ""} (never block)`);
  const verdict = r.blocked ? paint("31", "blocked") : paint("32", "ok");
  console.log(`  → ${parts.join(" · ")} · ${verdict}\n`);
}

function readParsed(file: string) {
  return parse(readFileSync(file, "utf8"));
}

function main(argv: string[]): number {
  const [cmd, ...rest] = argv;
  switch (cmd) {
    case "verify": {
      let against = "HEAD";
      let runCommands = true;
      const paths: string[] = [];
      for (let i = 0; i < rest.length; i++) {
        if (rest[i] === "--against") against = rest[++i] ?? "";
        else if (rest[i] === "--no-commands") runCommands = false;
        else paths.push(rest[i]);
      }
      const files = (paths.length ? paths : ["."]).flatMap(findIntentFiles);
      if (!files.length) {
        console.error("no .intent files found");
        return 1;
      }
      let blocked = 0;
      for (const file of files) {
        if (process.stdout.isTTY) process.stdout.write(paint("90", `verifying ${relative(process.cwd(), file)}…\r`));
        const report = verify(file, { against, runCommands });
        if (process.stdout.isTTY) process.stdout.write("\x1b[2K");
        printReport(report);
        if (report.blocked) blocked++;
      }
      console.log(
        blocked
          ? paint("31", `${blocked} of ${files.length} files blocked`)
          : paint("32", `${files.length} files verified, nothing blocks`),
      );
      return blocked ? 1 : 0;
    }
    case "lock": {
      const bump = rest.includes("--bump");
      const files = rest.filter((a) => a !== "--bump");
      if (!files.length) break;
      let bad = 0;
      for (const path of files) {
        try {
          const raw = readFileSync(path, "utf8");
          const file = parse(raw);
          const hash = computeLock(file);
          if (file.lock === hash && !bump) {
            console.log(`${mark("pass")} ${path}: already locked`);
            continue;
          }
          // A committed version keeps its goal and evals, whether or not the lock line survived editing.
          const committed = committedFile(resolve(path));
          const changedSinceCommit =
            committed?.version === file.version && computeLock(committed) !== hash;
          let updates: Record<string, string> = { lock: hash };
          if (bump) {
            const next = file.version + 1;
            updates = { version: String(next), supersedes: `${file.name}@${file.version}`, lock: hash };
          } else if (changedSinceCommit) {
            bad++;
            console.log(
              `${mark("fail")} ${path}: v${file.version} is already committed, so its goal and evals can't change. Use --bump to make v${file.version + 1}.`,
            );
            continue;
          }
          writeFileSync(path, setFrontMatter(raw, updates));
          const v = bump ? `v${file.version + 1}, supersedes ${file.name}@${file.version}, ` : "";
          console.log(`${mark("pass")} ${path}: ${v}locked ${hash.slice(0, 19)}…`);
        } catch (err) {
          bad++;
          console.log(`${mark("fail")} ${path}: ${(err as Error).message}`);
        }
      }
      return bad ? 1 : 0;
    }
    case "check": {
      let bad = 0;
      for (const file of rest) {
        try {
          readParsed(file);
          console.log(`${mark("pass")} ${file}`);
        } catch (err) {
          bad++;
          console.log(`${mark("fail")} ${file}: ${(err as Error).message}`);
        }
      }
      return bad ? 1 : 0;
    }
    case "words": {
      if (!rest[0]) break;
      console.log(words(readParsed(rest[0])));
      return 0;
    }
    case "examples": {
      if (!rest[0]) break;
      const found = examples(readParsed(rest[0]));
      if (!found.length) {
        console.log("no ```intent examples found");
        return 1;
      }
      let bad = 0;
      found.forEach((src, i) => {
        try {
          const f = parse(src);
          if (f.lock && f.lock !== computeLock(f)) throw new Error(`lock doesn't match goal and evals (expected ${computeLock(f)})`);
          console.log(`${mark("pass")} example ${i + 1}: ${f.name} v${f.version}`);
        } catch (err) {
          bad++;
          console.log(`${mark("fail")} example ${i + 1}: ${(err as Error).message}`);
        }
      });
      return bad ? 1 : 0;
    }
  }
  console.log(HELP);
  return cmd && cmd !== "help" && cmd !== "--help" ? 1 : 0;
}

process.exitCode = main(process.argv.slice(2));
