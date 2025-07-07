export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/books') {
      const { results } = await env.DB.prepare(`SELECT * FROM books ORDER BY id DESC`).all();
      return Response.json(results);
    }

    return new Response('Not found', { status: 404 });
  }
};
