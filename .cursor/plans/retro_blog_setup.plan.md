---
name: Retro Blog Setup
overview: Set up a 90s GeoCities-style personal blog with Cursor rules, using HTML, Tailwind CSS, and jQuery - all via CDN for GitHub Pages hosting.
todos:
  - id: create-rules-dir
    content: Create `.cursor/rules/` directory structure
    status: completed
  - id: project-conventions
    content: Create `project-conventions.mdc` rule (always apply)
    status: completed
  - id: html-standards
    content: Create `html-standards.mdc` rule (for HTML files)
    status: completed
  - id: retro-style-guide
    content: Create `retro-style-guide.mdc` rule (always apply)
    status: completed
  - id: css-tailwind
    content: Create `css-tailwind.mdc` rule (for HTML files)
    status: completed
  - id: js-jquery
    content: Create `js-jquery.mdc` rule (for HTML/JS files)
    status: completed
  - id: create-readme
    content: Create README.md with project overview
    status: completed
isProject: false
---

# Retro 90s Blog - Foundation Setup

## Project Overview

A personal blog with authentic 90s GeoCities aesthetic:

- Tiled/patterned backgrounds
- Animated GIFs (flames, etc.)
- "Best viewed in Netscape" badges
- Visitor counters (decorative)
- Web ring navigation
- Marquee-style scrolling text
- Bold, colorful typography
- Table-like layouts (using modern CSS Grid)

## Technology Stack

- **HTML5** - Semantic structure with retro styling
- **Tailwind CSS Play CDN** - No build step required, works on GitHub Pages
- **jQuery 3.x via CDN** - Classic library for DOM manipulation, effects, and interactivity
- **GitHub Pages** - Static hosting (no server-side code)

```html
<!-- CDN Scripts - no installation needed -->
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
```

### Why jQuery?

- Nostalgic fit for a 90s-themed project (jQuery was THE library of the 2000s-2010s)
- Simple, readable syntax for DOM manipulation
- Great for toggle effects, animations, and simple interactions
- Works perfectly via CDN - no build step
- Huge ecosystem of plugins if needed later

## Cursor Rules to Create

### 1. `.cursor/rules/project-conventions.mdc` (Always Apply)

Core project standards:

- File structure conventions
- Naming patterns (kebab-case for files)
- GitHub Pages constraints
- No build tools or dependencies

### 2. `.cursor/rules/html-standards.mdc` (Apply to `**/*.html`)

HTML conventions:

- Semantic HTML5 structure
- Accessibility basics (alt text, ARIA labels)
- Tailwind CDN script placement
- Meta tags for SEO and social sharing

### 3. `.cursor/rules/retro-style-guide.mdc` (Always Apply)

90s aesthetic guidelines:

- Color palette (hot pink, cyan, lime, yellow)
- Typography (Comic Sans, Times New Roman, system fonts)
- Common retro elements to include
- Background patterns and GIF usage

### 4. `.cursor/rules/css-tailwind.mdc` (Apply to `**/*.html`)

Tailwind + CSS conventions:

- Custom configuration via CDN config
- Utility class patterns
- When to use inline styles vs classes
- Animation approaches

### 5. `.cursor/rules/js-jquery.mdc` (Apply to `**/*.html, **/*.js`)

jQuery conventions:

- Use `$()` for DOM selection
- Document ready pattern: `$(function() { ... })`
- Prefer `.on()` for event binding
- Use jQuery effects for retro animations (fadeIn, slideToggle, etc.)
- Keep scripts at bottom of body or use defer

## Proposed File Structure

```
Blog/
├── .cursor/
│   └── rules/
│       ├── project-conventions.mdc
│       ├── html-standards.mdc
│       ├── retro-style-guide.mdc
│       ├── css-tailwind.mdc
│       └── js-jquery.mdc
├── index.html              # Homepage
├── posts/                  # Blog posts directory
│   └── my-first-post.html
├── about.html              # About page
├── guestbook.html          # Guestbook page
├── assets/
│   ├── images/             # Personal images
│   ├── gifs/               # Retro GIFs
│   └── js/                 # Custom JavaScript files
│       └── main.js         # Main site scripts
└── README.md               # Project documentation
```

## Key Constraints (GitHub Pages)

- All files must be static (HTML, CSS, JS, images)
- No server-side processing
- No build step (Tailwind via CDN only)
- Repository must be public or GitHub Pro for private Pages

