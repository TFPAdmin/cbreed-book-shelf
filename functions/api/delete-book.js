export async function onRequest(context) {
  const url = new URL(context.request.url);
  const bookId = url.searchParams.get("id");

  if (!bookId) {
    return new Response(JSON.stringify({ error: "Missing book ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const result = await context.env.DB.prepare(
      "DELETE FROM books WHERE id = ?"
    ).bind(bookId).run();

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
