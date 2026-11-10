import type { APIRoute, GetStaticPaths } from "astro";
import { getOldPosts } from "../../../lib/intents";

// Raw twin of a superseded version: /posts/<slug>/v<n>.intent
export const getStaticPaths: GetStaticPaths = () =>
  getOldPosts().map((page) => ({
    params: { slug: page.file.name, version: String(page.file.version) },
    props: { raw: page.file.raw },
  }));

export const GET: APIRoute = ({ props }) =>
  new Response(props.raw as string, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
