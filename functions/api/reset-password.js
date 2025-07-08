export async function onRequest(context) {
  try {
    const { username, new_password } = await context.request.json();

    if (!username || !new_password) {
      return new Response(JSON.stringify({ error: "Missing username or new password" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Hash the password using SHA-256 (same as your login system)
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(new_password));
    const password_hash = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");

    const result = await context.env.DB.prepare(`
      UPDATE users SET password_hash = ? WHERE username = ?
    `).bind(password_hash, username).run();

    if (result.success) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" }
      });
    } else {
      return new Response(JSON.stringify({ error: "Password update failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
