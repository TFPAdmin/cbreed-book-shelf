export async function onRequest(context) {
  try {
    const { DB } = context.env;
    const { results } = await DB.prepare(`SELECT * FROM books ORDER BY id DESC`).all();
    return Response.json(results);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
