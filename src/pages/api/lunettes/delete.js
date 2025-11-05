// src/pages/api/lunettes/delete.js
export const prerender = false;

import pb, { loadAuthFromCookie } from "../../../utils/pb.ts";

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST({ request, cookies }) {
  // Auth via cookie httpOnly
  const cookieVal = cookies.get("pb_auth")?.value;
  if (cookieVal) loadAuthFromCookie(`pb_auth=${cookieVal}`);
  if (!pb.authStore.isValid) return json({ error: "Unauthorized" }, 401);

  // body JSON ou FormData
  let id = null;
  try {
    const ct = request.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const data = await request.json();
      id = data?.id;
    } else if (ct.includes("multipart/form-data")) {
      const fd = await request.formData();
      id = fd.get("id");
    }
  } catch {} // id restera null

  if (!id) return json({ error: "Missing id" }, 400);

  // Récupérer l’enregistrement + vérifier propriétaire
  let rec;
  try {
    rec = await pb.collection("Lunette").getOne(id, { expand: "id_user,id_utilisateur" });
  } catch {
    return json({ error: "Record not found" }, 404);
  }

  const me = pb.authStore.model?.id ?? pb.authStore.record?.id;
  // les relations PB sont des tableaux d’ids ; tolère id_user OU id_utilisateur
  const owns =
    (Array.isArray(rec.id_user) && rec.id_user.includes(me)) ||
    (Array.isArray(rec.id_utilisateur) && rec.id_utilisateur.includes(me)) ||
    rec.id_user === me || rec.id_utilisateur === me;

  if (!owns) return json({ error: "Forbidden" }, 403);

  try {
    await pb.collection("Lunette").delete(id);
    return json({ ok: true });
  } catch (err) {
    const msg = err?.response?.message || err?.message || "Delete failed";
    return json({ error: msg }, 500);
  }
}
