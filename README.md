# My Retro Blog 🌐

A personal blog with authentic 90s GeoCities aesthetic, hosted on GitHub Pages.

## Tech Stack

- **HTML5** - Semantic structure
- **Tailwind CSS** - Via CDN (no build step)
- **jQuery 3.7** - Via CDN for interactivity

## JavaScript Architecture (SOLID Principles)

The JavaScript code is split into focused modules following Single Responsibility Principle:

| Module | Responsibility |
|--------|----------------|
| `greeting.js` | IP detection and timezone-based greetings |
| `content-loader.js` | Loading data from JSON files |
| `renderer.js` | Rendering content to the DOM |
| `effects.js` | Visual effects and animations |
| `main.js` | Orchestrates all modules |

Each module has a single, clear purpose making the code easier to maintain and test.

## Local Development

Simply open `index.html` in your browser. No build tools required!

For live reload during development, you can use any simple HTTP server:

```bash
# Python 3
python -m http.server 8000

# Then visit http://localhost:8000
```

## Deployment

This site is designed for GitHub Pages:

1. Push to your GitHub repository
2. Go to Settings → Pages
3. Select branch (usually `main`) and root folder
4. Your site will be live at `https://yourusername.github.io/repo-name`

## Project Structure

```
Blog/
├── index.html          # Homepage
├── about.html          # About page
├── guestbook.html      # Guestbook
├── posts/              # Blog posts
├── data/
│   ├── content.json    # Site info and about section
│   ├── posts.json      # Blog posts
│   └── links.json      # External links
├── assets/
│   ├── images/         # Personal images
│   ├── gifs/           # Retro GIFs
│   └── js/
│       ├── greeting.js       # IP & timezone-based greeting
│       ├── content-loader.js # Loads JSON data
│       ├── renderer.js       # Renders content to DOM
│       ├── effects.js        # Visual effects & animations
│       └── main.js           # Main orchestrator
└── README.md
```

## Managing Content

Content is managed through separate JSON files in the `data/` directory:

- **`content.json`** - Site title, subtitle, about section, visitor count, last updated
- **`posts.json`** - Blog posts array
- **`links.json`** - Links section

### Adding a New Blog Post

1. Create your HTML post file in `posts/` (e.g., `my-new-post.html`)
2. Add the post entry to `data/posts.json` in the `posts` array:
```json
{
  "title": "My New Post",
  "date": "February 5, 2026",
  "excerpt": "A brief description of your post...",
  "url": "posts/my-new-post.html"
}
```
3. The homepage will automatically display it!

### Adding/Updating Links

Edit the `links` array in `data/links.json`:
```json
{
  "label": "Twitter",
  "url": "https://twitter.com/yourusername"
}
```

### Updating Site Info

Edit `data/content.json` to change the site title, about text, or visitor count.

---

*Best viewed in Netscape Navigator 4.0* 🖥️
