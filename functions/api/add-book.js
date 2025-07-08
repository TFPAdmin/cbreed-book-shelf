export async function onRequest(context) {
  const auth = await context.request.json();
  const { loggedIn, title, subtitle, excerpt, cover, wattpad } = auth;

  if (!loggedIn) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    await context.env.DB.prepare(`
      INSERT INTO books (title, subtitle, excerpt, cover, wattpad)
      VALUES (?, ?, ?, ?, ?)
    `).bind(title, subtitle, excerpt, cover, wattpad).run();

    return new Response(JSON.stringify({ success: true }));
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
