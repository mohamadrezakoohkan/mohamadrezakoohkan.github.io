import type { APIRoute } from "astro";
import { getPage } from "../lib/intents";

// The raw twin of the spec page: /spec.intent
export const GET: APIRoute = () =>
  new Response(getPage("/spec").file.raw, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
