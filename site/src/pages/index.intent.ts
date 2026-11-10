import type { APIRoute } from "astro";
import { getPage } from "../lib/intents";

// The raw twin of the homepage: /index.intent
export const GET: APIRoute = () =>
  new Response(getPage("/").file.raw, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
