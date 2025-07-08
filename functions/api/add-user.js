export async function onRequest(context) {
  try {
    const { username, password_hash } = await context.request.json();

    if (!username || !password_hash) {
      return new Response(JSON.stringify({ error: "Missing username or password hash" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Optional: check if user already exists
    const existing = await context.env.DB.prepare(
      "SELECT id FROM users WHERE username = ?"
    ).bind(username).first();

    if (existing) {
      return new Response(JSON.stringify({ error: "Username already exists" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    await context.env.DB.prepare(`
      INSERT INTO users (username, password_hash)
      VALUES (?, ?)
    `).bind(username, password_hash).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
