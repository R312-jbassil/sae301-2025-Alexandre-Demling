// src/pages/api/lunettes/update.js
export const prerender = false;

import pb, { loadAuthFromCookie } from "../../../utils/pb.ts";

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function collection() {
  try { return pb.collection("Lunette"); }
  catch { return pb.collection("lunette"); }
}

export async function POST({ request, cookies }) {
  try {
    // 1) Auth httpOnly
    const cookieVal = cookies.get("pb_auth")?.value;
    if (cookieVal) loadAuthFromCookie(`pb_auth=${cookieVal}`);
    if (!pb.authStore.isValid) return json({ error: "Unauthorized" }, 401);

    // 2) Body
    const { id, code_svg, name } = await request.json().catch(() => ({}));
    if (!id)       return json({ error: "Missing id" }, 400);
    if (!code_svg) return json({ error: "Missing code_svg" }, 400);

    const me = pb.authStore.model?.id ?? pb.authStore.record?.id;

    // 3) Vérifier que l'enregistrement existe et appartient au user
    const rec = await collection().getOne(id);

    const owns =
      rec.id_user === me ||
      (Array.isArray(rec.id_user) && rec.id_user.includes(me));

    if (!owns) return json({ error: "Forbidden" }, 403);

    // 4) Mettre à jour uniquement les champs concernés
    const payload = {
      code_svg,
      ...(name ? { nom_lunette: name } : {}),
    };

    const updated = await collection().update(id, payload);
    return json({ ok: true, data: updated });
  } catch (err) {
    console.error("❌ Update error:", err);
    const fields = err?.response?.data?.data;
    if (fields && typeof fields === "object") {
      const details = Object.entries(fields)
        .map(([k, v]) => `${k}: ${v?.message || JSON.stringify(v)}`)
        .join("; ");
      return json({ error: details || "Update failed" }, 400);
    }
    return json({ error: err?.response?.data?.message || err?.message || "Update failed" }, 500);
  }
}
