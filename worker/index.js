// Serves the blog and stores reader reactions ("Leave a mark") in Cloudflare KV.
const KINDS = ['felt', 'think', 'smile'];
const SLUG = /^[a-z0-9-]{1,120}$/;

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

async function readCounts(env, slug) {
  const raw = await env.REACTIONS.get(`r:${slug}`);
  const counts = raw ? JSON.parse(raw) : {};
  return Object.fromEntries(KINDS.map((k) => [k, Math.max(0, counts[k] | 0)]));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const match = url.pathname.match(/^\/api\/reactions\/([^/]+)\/?$/);
    if (!match) return env.ASSETS.fetch(request);

    const slug = match[1];
    if (!SLUG.test(slug)) return json({ error: 'Unknown post' }, 404);
    if (!env.REACTIONS) return json({ error: 'Reactions storage is not set up' }, 503);

    if (request.method === 'GET') return json(await readCounts(env, slug));

    if (request.method === 'POST') {
      // Only count reactions for posts that actually exist on the site.
      const page = await env.ASSETS.fetch(new Request(new URL(`/posts/${slug}/`, url)));
      if (page.status !== 200) return json({ error: 'Unknown post' }, 404);

      let body;
      try { body = await request.json(); } catch { return json({ error: 'Bad request' }, 400); }
      const { kind, action } = body || {};
      if (!KINDS.includes(kind) || !['add', 'remove'].includes(action)) return json({ error: 'Bad request' }, 400);

      const counts = await readCounts(env, slug);
      counts[kind] = Math.max(0, counts[kind] + (action === 'add' ? 1 : -1));
      await env.REACTIONS.put(`r:${slug}`, JSON.stringify(counts));
      return json(counts);
    }

    return json({ error: 'Method not allowed' }, 405);
  },
};
