export async function onRequest(context) {
  try {
    const body = await context.request.json();
    const { loggedIn, username, title, subtitle, excerpt, cover, wattpad } = body;

    if (!loggedIn || !username) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Insert the new book
    await context.env.DB.prepare(`
      INSERT INTO books (title, subtitle, excerpt, cover, wattpad)
      VALUES (?, ?, ?, ?, ?)
    `).bind(title, subtitle, excerpt, cover, wattpad).run();

    // Log the action
    await context.env.DB.prepare(`
      INSERT INTO user_logs (username, action)
      VALUES (?, ?)
    `).bind(username, `Added book "${title}"`).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
