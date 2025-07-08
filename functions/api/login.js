import bcrypt from "bcryptjs";

export async function onRequest(context) {
  const body = await context.request.json();
  const { username, password } = body;

  const result = await context.env.DB
    .prepare("SELECT * FROM users WHERE username = ?")
    .bind(username).first();

  if (!result) {
    return new Response(JSON.stringify({ error: "Invalid user" }), { status: 401 });
  }

  const isValid = await bcrypt.compare(password, result.password_hash);
  if (!isValid) {
    return new Response(JSON.stringify({ error: "Invalid password" }), { status: 401 });
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" }
  });
}
