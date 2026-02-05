---
name: Blog Writing Cursor Rule
overview: Create a Cursor rule at `.cursor/rules/blog-writing.mdc` that encodes Reza's evolutionary blog philosophy as actionable instructions for the AI when writing blog posts -- covering content strategy, voice, format, and the data-driven post creation workflow.
todos:
  - id: create-rule
    content: "Create `.cursor/rules/blog-writing.mdc` with frontmatter (globs: data/posts.json, posts/**) and all four sections"
    status: pending
isProject: false
---

# Blog Writing Cursor Rule

## What

Create a single `.mdc` rule file at `[.cursor/rules/blog-writing.mdc](.cursor/rules/blog-writing.mdc)` that the AI follows whenever asked to write or draft a blog post.

## Scope

- `**alwaysApply: false**` with `**globs: data/posts.json, posts/****` -- activates when working with blog post files, keeping other workflows clean.

## Rule Content Structure

The rule will have four sections:

### 1. Evolutionary Content Philosophy (The "Why")

Distill the four pillars of your mental model into concise directives:

- **Primordial Soup** -- Early posts establish ancestral DNA. Don't aim for authority; aim for a viable genetic base. Each post should plant a trait that future content can inherit.
- **Minimum Evolvable Product** -- Posts are lungfish, not final forms. Ship ideas fast. Leave room for mutation. A post that sparks unexpected traction is a signal to evolve toward, not a fluke.
- **Environmental Selection** -- Readers are selective pressure, not an audience to please. Low traffic is not failure; it's pre-selection. Double down on traits the environment feeds with attention.
- **Adaptation via Iteration** -- The blog is a living organism. Features, formats, and recurring themes are adaptations that emerge, not features that are planned.

### 2. Writing Voice & Tone

Grounded in Reza's profile (iOS Engineer since 2016, 10,000+ releases):

- Write from practitioner experience, not academic authority
- Conversational but technically credible -- like explaining to a sharp colleague
- Opinionated when warranted; cite real-world shipping experience as evidence
- Avoid hedging language ("I think maybe...") -- prefer direct, confident statements
- Keep the retro blog personality: concise, no fluff, content-first

### 3. Post Format & Technical Requirements

Based on the existing architecture in `[data/posts.json](data/posts.json)`:

- Every post is a JSON object appended to the `posts` array
- Required fields: `id` (kebab-case), `title`, `date`, `excerpt`, `url`, `content`
- `content` is an array of strings, each a paragraph
- Headings use `═══ HEADING TEXT ═══` format
- Bullet points use `•` prefix
- `url` follows pattern `posts/post.html?id={id}`
- `excerpt` is 1-2 sentences max -- the "hook"
- New posts go at the **top** of the array (newest first)

### 4. Content Checklist (Pre-Ship)

A quick checklist the AI should verify before finalizing any post:

- Does the post plant at least one "ancestral trait" (a theme, opinion, or technical insight that future posts can reference or build on)?
- Is the excerpt compelling enough to survive "environmental selection"?
- Is the tone practitioner-first, not tutorial-first?
- Does the JSON structure match the existing schema exactly?
- Is the `id` unique and kebab-cased?
- Does the `date` use the format "Month Day, Year"?

