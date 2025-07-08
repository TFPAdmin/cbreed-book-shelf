export async function onRequest(context) {
  try {
    const body = await context.request.json();
    const { username, password } = body;

    if (!username || !password) {
      return new Response(JSON.stringify({ error: "Missing credentials" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Find user
    const result = await context.env.DB.prepare(
      "SELECT * FROM users WHERE username = ?"
    ).bind(username).first();

    if (!result) {
      return new Response(JSON.stringify({
        error: "Invalid user",
        debugUsername: username
      }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Hash the password for comparison
    const hashBuffer = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(password)
    );
    const hashHex = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");

    const expectedHash = result.password_hash;

    if (hashHex !== expectedHash) {
      return new Response(JSON.stringify({
        error: "Invalid password",
        debugUsername: username,
        debugHash: hashHex,
        expectedHash
      }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Log the login action
    await context.env.DB.prepare(`
      INSERT INTO user_logs (username, action)
      VALUES (?, ?)
    `).bind(username, "Logged in").run();

    return new Response(JSON.stringify({
      success: true,
      username
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
