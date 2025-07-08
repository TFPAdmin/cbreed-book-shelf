export async function onRequest(context) {
  try {
    const { loggedIn, adminUsername, username, password_hash } = await context.request.json();

    if (!loggedIn || !adminUsername) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (!username || !password_hash) {
      return new Response(JSON.stringify({ error: "Missing username or password hash" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Check if username already exists
    const existing = await context.env.DB.prepare(
      "SELECT id FROM users WHERE username = ?"
    ).bind(username).first();

    if (existing) {
      return new Response(JSON.stringify({ error: "Username already exists" }), {
        status: 409,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Insert new user
    await context.env.DB.prepare(`
      INSERT INTO users (username, password_hash)
      VALUES (?, ?)
    `).bind(username, password_hash).run();

    // Log the action
    await context.env.DB.prepare(`
      INSERT INTO user_logs (username, action)
      VALUES (?, ?)
    `).bind(adminUsername, `Added user "${username}"`).run();

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
