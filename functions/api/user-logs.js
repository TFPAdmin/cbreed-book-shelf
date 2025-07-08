export async function onRequest(context) {
  try {
    const url = new URL(context.request.url);
    const username = url.searchParams.get("username");

    let query = "SELECT username, action, timestamp FROM user_logs";
    let params = [];

    if (username) {
      query += " WHERE username = ?";
      params.push(username);
    }

    query += " ORDER BY timestamp DESC LIMIT 50";

    const { results } = await context.env.DB.prepare(query).bind(...params).all();

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
