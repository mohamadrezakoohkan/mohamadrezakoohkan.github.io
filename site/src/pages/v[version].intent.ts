import type { APIRoute, GetStaticPaths } from "astro";
import { getOldHome } from "../lib/intents";

// Raw twin of a superseded homepage: /v<n>.intent
export const getStaticPaths: GetStaticPaths = () =>
  getOldHome().map((page) => ({
    params: { version: String(page.file.version) },
    props: { raw: page.file.raw },
  }));

export const GET: APIRoute = ({ props }) =>
  new Response(props.raw as string, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
