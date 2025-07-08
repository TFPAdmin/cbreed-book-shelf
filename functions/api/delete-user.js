export async function onRequest(context) {
  try {
    const url = new URL(context.request.url);
    const id = url.searchParams.get("id");
    const username = url.searchParams.get("username");

    if (!id && !username) {
      return new Response(JSON.stringify({ error: "Missing id or username" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const statement = id
      ? context.env.DB.prepare("DELETE FROM users WHERE id = ?").bind(id)
      : context.env.DB.prepare("DELETE FROM users WHERE username = ?").bind(username);

    const result = await statement.run();

    if (result.success) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" }
      });
    } else {
      return new Response(JSON.stringify({ error: "Delete failed" }), {
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
