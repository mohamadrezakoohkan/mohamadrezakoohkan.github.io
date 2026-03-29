// src/content.config.ts
// ─────────────────────────────────────────────────────────────
// Content Collections configuration.
//
// Astro's Content Collections API lets us define a schema for
// our markdown frontmatter.  This gives us automatic validation
// and TypeScript types – if a post is missing a required field
// or has the wrong type, Astro will throw a helpful error at
// build time instead of silently breaking.
//
// In Astro v5+ this file lives at `src/content.config.ts` and
// uses the new `glob` content loader.
// ─────────────────────────────────────────────────────────────
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Define the "blog" collection.
// Every .md file inside `src/content/blog/` must have frontmatter
// that matches this schema.
const blog = defineCollection({
  // The glob loader tells Astro where to find the source files
  // for this collection and what format they are in.
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),

  schema: z.object({
    // `title` – The display title of the post (required string).
    title: z.string(),

    // `date` – Publication date.  We coerce the YAML date string
    //          into a JavaScript Date object automatically.
    date: z.coerce.date(),

    // `description` – A short summary shown on the home page and
    //                 used for SEO <meta> tags (required string).
    description: z.string(),
  }),
});

// Export all collections so Astro can discover them.
export const collections = { blog };
