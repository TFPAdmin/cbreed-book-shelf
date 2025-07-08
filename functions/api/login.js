export async function onRequest(context) {
  const body = await context.request.json();
  const { username, password } = body;

  const result = await context.env.DB
    .prepare("SELECT * FROM users WHERE username = ?")
    .bind(username).first();

  if (!result) {
    return new Response(JSON.stringify({
      error: "Invalid user",
      debug: { receivedUsername: username }
    }), { status: 401 });
  }

  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(password)
  );
  const hashHex = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  const response = {
    debugUsername: username,
    debugHash: hashHex,
    expectedHash: result.password_hash,
  };

  if (hashHex !== result.password_hash) {
    return new Response(JSON.stringify({
      error: "Invalid password",
      ...response
    }), { status: 401 });
  }

  return new Response(JSON.stringify({
    success: true,
    ...response
  }), {
    headers: { "Content-Type": "application/json" }
  });
}
