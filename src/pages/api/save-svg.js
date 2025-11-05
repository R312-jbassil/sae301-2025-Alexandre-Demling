// src/pages/api/save-svg.js
export const prerender = false;

import pb, { loadAuthFromCookie } from "../../utils/pb.ts";

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST({ request, cookies }) {
  try {
    // 1) Auth via cookie httpOnly
    const cookieVal = cookies.get("pb_auth")?.value;
    if (cookieVal) loadAuthFromCookie(`pb_auth=${cookieVal}`);
    if (!pb.authStore.isValid) return json({ success: false, error: "Unauthorized" }, 401);

    // 2) Body
    const { name, code_svg, chat_history } = await request.json().catch(() => ({}));
    if (!code_svg) return json({ success: false, error: "code_svg is required" }, 400);

    const me = pb.authStore.model?.id ?? pb.authStore.record?.id;

    // 3) Création dans LA BONNE COLLECTION (slug API = "lunette")
    //    Ne mets ici QUE des champs qui existent réellement dans ta collection Lunette :
    const payload = {
      code_svg,                        // champ texte long dans "Lunette"
      id_user: me ? [me] : [],         // relation -> tableau d'ids (si ton champ s'appelle id_user)
      chat_history: chat_history || [],// si tu as un champ JSON "chat_history" (sinon retire-le)
      nom: name || null,               // si tu as un champ "nom" (facultatif)
    };

    // supprime les clés non définies pour éviter les rejets silencieux
    Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);

    const rec = await pb.collection("lunette").create(payload);
    return json({ success: true, data: rec });
  } catch (error) {
    console.error("❌ Error saving SVG:", error);
    const msg = error?.response?.message || error?.message || "Save failed";
    return json({ success: false, error: msg }, 500);
  }
}
