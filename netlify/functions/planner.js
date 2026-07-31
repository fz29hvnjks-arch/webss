import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore("planners");

  if (req.method === "POST") {
    const body = await req.json();
    const id = body.id || Date.now().toString();
    await store.setJSON(id, body);
    return new Response(JSON.stringify({ success: true, id }), { status: 200 });
  }

  if (req.method === "GET") {
    const { blobs } = await store.list();
    const items = await Promise.all(
      blobs.map((b) => store.get(b.key, { type: "json" }))
    );
    return new Response(JSON.stringify(items), { status: 200 });
  }

  return new Response("Method not allowed", { status: 405 });
};
