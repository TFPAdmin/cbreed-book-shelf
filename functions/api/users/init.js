export async function onRequest(context) {
  const username = "admin";

  // Precomputed SHA-256 hash of "admin123"
  const password_hash = "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f";

  try {
    await context.env.DB.prepare(
      `INSERT INTO users (username, password_hash) VALUES (?, ?)`
    ).bind(username, password_hash).run();

    return new Response("Admin user created successfully", { status: 200 });
  } catch (e) {
    return new Response("Error: " + e.message, { status: 500 });
  }
}
