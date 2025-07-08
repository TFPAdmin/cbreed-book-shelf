export async function onRequest(context) {
  const body = await context.request.json();
  const { username, password } = body;

  const result = await context.env.DB
    .prepare("SELECT * FROM users WHERE username = ?")
    .bind(username).first();

  if (!result) {
    return new Response(JSON.stringify({ error: "Invalid user" }), { status: 401 });
  }

  // Hash incoming password to compare
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(password)
  );
  const hashHex = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  if (hashHex !== result.password_hash) {
    return new Response(JSON.stringify({ error: "Invalid password" }), { status: 401 });
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" }
  });
}
