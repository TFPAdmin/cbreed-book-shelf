export async function onRequest(context) {
  const username = "admin";
  const password_hash = "$2a$10$q8/0h.7DYYW8RQnR63Iq7O4R1i4fAog14jU2KKMCu9QoCshZkV/nK"; // hash of "admin123"

  try {
    await context.env.DB.prepare(
      `INSERT INTO users (username, password_hash) VALUES (?, ?)`
    ).bind(username, password_hash).run();

    return new Response("Admin user created successfully", { status: 200 });
  } catch (e) {
    return new Response("Error: " + e.message, { status: 500 });
  }
}

