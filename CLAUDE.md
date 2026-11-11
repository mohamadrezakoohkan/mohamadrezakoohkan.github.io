# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

mohamadreza.com, the home of the `.intent` file format. Every published page is itself a `.intent` file that the deploy verifies. The repo is an npm-workspaces monorepo with three parts:

- `spec/spec.intent`: the formal spec of the format (itself a `.intent` file, published at `/spec`).
- `tool/`: `@intent/tool`, the reference parser and the `intent` CLI.
- `site/`: the Astro 5 site, which renders `.intent` files through the tool's parser.

`site.intent` at the repo root is the record of design decisions for the site itself. It is verified like the others but not published. Read it before changing how the site looks or behaves, and record new decisions in its Fulfillment.

## Commands

Run everything from the repo root. Node 22.6 or newer is required: the tool has no build step and runs its TypeScript directly through Node's type stripping (so imports inside `tool/` carry the `.ts` extension).

```bash
npm install                 # installs both workspaces, links the `intent` bin
npm run dev                 # Astro dev server on :4321 (also `site` in .claude/launch.json)
npm run build               # builds site/ into dist/ at the repo root
npm run verify              # verify every .intent file in the repo
npm run verify -- site/content/posts/launch.intent     # verify one file
npm run verify -- --no-commands                         # skip shell tests; check locks and recorded verdicts only
npm run verify -- --against <git-rev>                   # compare goal/evals with another revision (default HEAD)
npm run intent -- check <files...>      # parse only
npm run intent -- lock <files...>       # write the lock hash
npm run intent -- lock --bump <file>    # start the next version
npm run intent -- words <file>          # word count of the fulfillment
npm run intent -- examples <file>       # parse every ```intent example in the fulfillment
```

There is no unit-test runner or linter. `npm run verify` is the test suite: the `test:` evals inside the `.intent` files are the tests.

Things to know about verify:

- Evals call `intent` by bare name (`intent words "$INTENT_FILE"`), which only resolves because `npm run` puts `node_modules/.bin` on `PATH`. Go through the npm scripts rather than invoking `tool/src/cli.ts` directly.
- Each test runs with `sh -c` in the folder that holds its file, with the file's absolute path in `INTENT_FILE`.
- `site.intent` has tests that run `npm run build` and then look inside `dist/`, so a full verify rebuilds the site.

## The .intent contract

A file is front matter plus `# Goal`, `# Evals`, `# Fulfillment` and an optional `# Results`, in that order. `spec/spec.intent` is the authority on the grammar.

- **Goal and Evals are locked within a version.** Treat them as read-only. Never edit them to make a failing eval pass. If the goal or evals really need to change, that is a new version: `intent lock --bump` raises `version`, sets `supersedes: name@N`, and re-locks.
- **Fulfillment, Results and `title` are free.** Editing them never needs a re-lock or a new version.
- The `lock:` front-matter line is a SHA-256 of the whitespace-normalised goal and evals (`tool/src/lock.ts`). Verify fails on a missing or mismatched lock. `intent lock` refuses to re-lock a version that is already committed with a different goal or evals.
- Verify applies two separate checks: `hash` (lock matches the file's own goal and evals) and `lock` (goal and evals are unchanged against a git revision unless the version went up with the right `supersedes`).
- Eval kinds: `test:` runs as a shell command; `judge:` and `review:` are never executed, their verdicts are read from `# Results` lines such as `- judge 1: ✓ 2026-11-10 — reason`, matched by kind and position; `watch:` never blocks.
- Only ✗ blocks. Pending (○) is a valid state. A recorded `✗` for a judge or review blocks the deploy just like a failing test.
- A standing judge in `site.intent`: no eval, page or tool option may name a specific AI provider or model.

## How the site is put together

`site/src/lib/intents.ts` is the whole content layer. At build time it globs `site/content/**/*.intent` and `spec/*.intent` as raw text, parses them with `@intent/tool/parse`, renders the fulfillment with `marked`, and exposes `getPage`, `getPosts`, `getOldPosts`, `getOldHome`. There are no Astro content collections.

- URL comes from the path: `site/content/index.intent` is `/`, `site/content/posts/<slug>.intent` is `/posts/<slug>`, `spec/spec.intent` is `/spec`.
- **Superseded versions are not stored in the working tree.** `olderVersions()` walks `git log` for the file and reads the last committed text of each lower version, which is published at `/posts/<slug>/v<n>` (or `/v<n>` for the homepage). Consequences: the build needs full git history (CI checks out with `fetch-depth: 0`), and renaming or moving a `.intent` file drops its old-version URLs.
- Every page route in `site/src/pages` has a twin `*.intent.ts` endpoint that serves the raw file as `text/plain` (`/posts/launch` and `/posts/launch.intent`). Add both when adding a route.
- `site/src/components/IntentPage.astro` is the single layout: headline (the `title`, or the goal if there is none), the locked goal line, evals as margin notes with ✓ / ✗ / ○, the body, and a no-JavaScript "View source" `<details>`. Its only client JavaScript is the inline theme switch and the optional Cloudflare beacon (enabled by `PUBLIC_CF_BEACON_TOKEN`).
- `site/src/components/Comments.astro` adds giscus comments (stored in this repo's GitHub Discussions, matched by pathname) to current post pages only, through the layout's slot. The widget script loads lazily when the reader scrolls near it and follows the header's theme switch. Superseded versions and non-post pages take no comments.
- On the rendered page, tests are always shown as ✓: a failing test would have blocked the deploy, so the site never runs them itself.

To add a post, create `site/content/posts/<slug>.intent` with `name` equal to the slug (the old-version route builds its URL from `name`), a `date` (posts sort by it, newest first) and usually a `title`, then run `npm run intent -- lock` on it.

## Tool and spec move together

`tool/src/parse.ts` is the reference implementation of `spec/spec.intent`, and the spec carries a judge that a parser written from the page alone behaves the same as the tool. A change to parsing, the lock computation or the Results grammar needs the matching change in the spec's Fulfillment, and the spec's own test (`intent examples`) re-parses every ```` ```intent ```` example on the page, including checking any `lock:` an example carries.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`: `npm ci`, `npm run build`, then `npm run verify -- --against <previous pushed commit>`, then publish `dist/` to GitHub Pages. Any ✗ in any `.intent` file stops the deploy, so run `npm run verify` before pushing.
