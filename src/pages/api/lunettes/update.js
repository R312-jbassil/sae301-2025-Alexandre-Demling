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

/**
 * Scope le CSS d’un SVG pour éviter que ses styles affectent d’autres SVG.
 * - ajoute data-scope="<scopeId>" sur <svg>
 * - préfixe tous les sélecteurs des <style> par [data-scope="<scopeId>"]
 */
function scopeSvgCss(svgString, scopeId) {
  if (!svgString || typeof svgString !== "string") return svgString;

  // déjà scopé ?
  if (new RegExp(`data-scope=["']${scopeId}["']`).test(svgString)) {
    return svgString;
  }

  // 1) ajouter data-scope sur <svg> (si pas déjà présent)
  let out = svgString.replace(
    /<svg\b([^>]*)>/i,
    (m, attrs) => (/\bdata-scope=/.test(attrs)
      ? `<svg${attrs}>`
      : `<svg${attrs} data-scope="${scopeId}">`)
  );

  // 2) préfixer chaque bloc de règles dans <style> … </style> (ignore les @-rules)
  out = out.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (_m, css) => {
    if (/\[data-scope=/.test(css)) return `<style>${css}</style>`;
    const prefixed = String(css).replace(
      /(^|})(\s*)([^@}{][^{]*?)\s*\{/g,
      (__, before, spaces, selector) =>
        `${before}${spaces}[data-scope="${scopeId}"] ${selector} {`
    );
    return `<style>${prefixed}</style>`;
  });

  return out;
}

export async function POST({ request, cookies }) {
  try {
    // 1) Auth httpOnly
    const cookieVal = cookies.get("pb_auth")?.value;
    if (cookieVal) loadAuthFromCookie(`pb_auth=${cookieVal}`);
    if (!pb.authStore.isValid) return json({ error: "Unauthorized" }, 401);

    // 2) Body
    const { id, cod_svg, name } = await request.json().catch(() => ({}));
    if (!id)      return json({ error: "Missing id" }, 400);
    if (!cod_svg) return json({ error: "Missing cod_svg" }, 400);

    const me = pb.authStore.model?.id ?? pb.authStore.record?.id;

    // 3) Vérifier que l'enregistrement existe et appartient au user
    const rec = await collection().getOne(id);
    const owns =
      rec.id_user === me ||
      (Array.isArray(rec.id_user) && rec.id_user.includes(me));
    if (!owns) return json({ error: "Forbidden" }, 403);

    // 4) Scope du SVG pour éviter les fuites de style (scope stable basé sur l'id)
    const scopedSvg = scopeSvgCss(cod_svg, `lu-${id}`);

    // 5) Mettre à jour uniquement les champs concernés
    const payload = {
      cod_svg: scopedSvg,            // <-- champ PB
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
