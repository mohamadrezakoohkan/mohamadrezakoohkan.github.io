import type { APIRoute, GetStaticPaths } from "astro";
import { getPosts } from "../../lib/intents";

// The raw twin of each post: /posts/<slug>.intent
export const getStaticPaths: GetStaticPaths = () =>
  getPosts().map((page) => ({
    params: { slug: page.url.replace("/posts/", "") },
    props: { raw: page.file.raw },
  }));

export const GET: APIRoute = ({ props }) =>
  new Response(props.raw as string, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
