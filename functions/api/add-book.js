export async function onRequest(context) {
  const { title, subtitle, excerpt, cover, wattpad } = await context.request.json();

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
