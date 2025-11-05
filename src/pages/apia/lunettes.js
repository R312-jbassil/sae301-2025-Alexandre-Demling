// src/pages/api/lunettes.js
export const prerender = false;

import pb, { loadAuthFromCookie } from "../../utils/pb.ts";

const toInt = (v) => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
};
const looksLikeId = (v) => /^[a-z0-9]{15,16}$/i.test(String(v || ""));

async function resolveInOne(colSlug, filter) {
  try {
    const rec = await pb.collection(colSlug).getFirstListItem(filter);
    return rec?.id || null;
  } catch {
    return null;
  }
}

// essaie ID direct, sinon cherche par les bons champs, et sur 2 slugs possibles
async function resolveToId({ slugs, value, fields }) {
  if (!value) return null;
  const v = String(value).trim();

  // id direct
  if (looksLikeId(v)) {
    for (const s of slugs) {
      try { const r = await pb.collection(s).getOne(v); return r?.id || null; } catch {}
    }
  }

  const esc = v.replace(/"/g, '\\"');

  for (const s of slugs) {
    for (const f of fields) {
      const id = await resolveInOne(s, `${f}="${esc}"`);
      if (id) return id;
    }
  }
  return null;
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST({ request, cookies }) {
  // 1) Auth
  const cookieVal = cookies.get("pb_auth")?.value;
  if (cookieVal) loadAuthFromCookie(`pb_auth=${cookieVal}`);
  if (!pb.authStore.isValid) return json({ error: "Unauthorized" }, 401);

  // 2) Body
  let data = {};
  try { data = await request.json(); }
  catch { return json({ error: "Invalid JSON body" }, 400); }

  // 3) Résoudre labels -> IDs avec les bons champs
  const matMontId = await resolveToId({
    slugs: ["Materiaux", "materiaux"],
    value: data.matMont ?? data.materiaux_monture,
    fields: ["libelle"],              // <-- champ exact
  });
  const matBraId = await resolveToId({
    slugs: ["Materiaux", "materiaux"],
    value: data.matBra ?? data.materiaux_branche,
    fields: ["libelle"],
  });
  const colMontId = await resolveToId({
    slugs: ["Couleur", "couleur"],
    value: data.colorMont ?? data.couleur_monture ?? data.colorMontHex,
    fields: ["nom_couleur"],          // <-- champ exact
  });
  const colBraId = await resolveToId({
    slugs: ["Couleur", "couleur"],
    value: data.colorBra ?? data.couleur_branche ?? data.colorBraHex,
    fields: ["nom_couleur"],
  });

  const userId = pb.authStore.model?.id ?? pb.authStore.record?.id ?? null;

  const missing = [];
  if (!matMontId) missing.push("materiaux_monture");
  if (!matBraId)  missing.push("materiaux_branche");
  if (!colMontId) missing.push("couleur_monture");
  if (!colBraId)  missing.push("couleur_branche");

  if (missing.length) {
    return json({
      error: "Relations introuvables: " + missing.join(", ") +
        ". Donne l’accès lecture à Materiaux/Couleur (List/View), ou envoie directement les IDs.",
    }, 400);
  }

  // 4) Création (relations => tableaux d'IDs)
  const payload = {
    materiaux_monture: [matMontId],
    materiaux_branche: [matBraId],
    couleur_monture:   [colMontId],
    couleur_branche:   [colBraId],
    id_user:           [userId], // adapte si le champ s’appelle autrement

    largeur_pont_mm: toInt(data.pont),
    taille_verre_mm: toInt(data.verres),

    // si tu as un champ "code_svg" (texte long)
    ...(data.svg !== undefined ? { cod_svg: data.svg } : {}),
  };

  try {
    const rec = await pb.collection("lunette").create(payload); // slug vu dans tes logs
    return json({ ok: true, id: rec.id });
  } catch (err) {
    const fields = err?.response?.data?.data ?? err?.data?.data ?? null;
    const nice =
      fields
        ? Object.entries(fields).map(([k, v]) => `${k}: ${v?.message || JSON.stringify(v)}`).join("; ")
        : err?.response?.message || err?.message || "Create failed";
    console.error("PocketBase create error:", { status: err?.status, message: nice, fields });
    return json({ error: nice }, 400);
  }
}
