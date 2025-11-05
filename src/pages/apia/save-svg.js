// src/pages/api/save-svg.js
export const prerender = false;

import pb, { loadAuthFromCookie } from "../../utils/pb.ts";

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// échappe les guillemets pour les filtres PocketBase
const esc = (s = "") => String(s).replace(/"/g, '\\"');

// Résout un libellé -> id dans une collection et un ou plusieurs champs texte
async function resolveByLabel(collection, label, fields) {
  if (!label) return null;
  for (const f of fields) {
    try {
      const rec = await pb.collection(collection).getFirstListItem(`${f}="${esc(label)}"`);
      if (rec?.id) return rec.id;
    } catch (_) {
      // pas trouvé avec ce champ, on essaie le suivant
    }
  }
  return null;
}

export async function POST({ request, cookies }) {
  try {
    // 1) Auth via cookie httpOnly
    const cookieVal = cookies.get("pb_auth")?.value;
    if (cookieVal) loadAuthFromCookie(`pb_auth=${cookieVal}`);
    if (!pb.authStore.isValid) {
      return json({ success: false, error: "Unauthorized" }, 401);
    }

    // 2) Body — mêmes clés que le front
    const {
      nom_lunette,
      cod_svg,
      largeur_pont_mm,
      taille_verre_mm,
      // libellés à résoudre
      matMontLabel,
      matBraLabel,
      colMontLabel,
      colBraLabel,
      chat_history,
    } = await request.json().catch(() => ({}));

    if (!cod_svg) return json({ success: false, error: "code_svg is required" }, 400);

    // id du user connecté (collection "users")
    const me = pb.authStore.model?.id ?? pb.authStore.record?.id;

    // 3) Résolution des relations d'après ton schéma :
    //    - Materiaux.libelle
    //    - Couleur.nom_couleur
    const materiaux_monture = await resolveByLabel("materiaux", matMontLabel, ["libelle"]);
    const materiaux_branche = await resolveByLabel("materiaux", matBraLabel, ["libelle"]);
    const couleur_monture   = await resolveByLabel("couleur",   colMontLabel, ["nom_couleur"]);
    const couleur_branche   = await resolveByLabel("couleur",   colBraLabel, ["nom_couleur"]);

    // 4) Payload pour "lunette"
    const payload = {
      nom_lunette: nom_lunette ?? null,
      cod_svg,
      largeur_pont_mm: Number.isFinite(largeur_pont_mm) ? largeur_pont_mm : null,
      taille_verre_mm: Number.isFinite(taille_verre_mm) ? taille_verre_mm : null,
      chat_history: chat_history || [],
      // RATTACHEMENT AU USER ACTUEL
      ...(me ? { id_user: me } : {}),

      // relations (ajoutées seulement si un id a été trouvé)
      ...(materiaux_monture ? { materiaux_monture } : {}),
      ...(materiaux_branche ? { materiaux_branche } : {}),
      ...(couleur_monture   ? { couleur_monture }   : {}),
      ...(couleur_branche   ? { couleur_branche }   : {}),
    };

    // Nettoyage des undefined
    Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

    const rec = await pb.collection("lunette").create(payload);
    return json({ success: true, data: rec });
  } catch (error) {
    console.error("❌ Error saving SVG:", error);
    const detail = error?.response?.data ? ` | details: ${JSON.stringify(error.response.data)}` : "";
    const msg = error?.response?.message || error?.message || "Save failed";
    return json({ success: false, error: `${msg}${detail}` }, 500);
  }
}
