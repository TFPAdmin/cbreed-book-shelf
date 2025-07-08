export async function onRequest(context) {
  try {
    const { results } = await context.env.DB.prepare(`
      SELECT id, username FROM users ORDER BY id ASC
    `).all();

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
