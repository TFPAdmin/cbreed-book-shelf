export async function onRequest(context) {
  try {
    const { DB } = context.env;
    const { results } = await DB.prepare(
      `SELECT * FROM books ORDER BY id ASC`
    ).all();
    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
