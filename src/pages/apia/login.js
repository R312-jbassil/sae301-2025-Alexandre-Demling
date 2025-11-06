// src/pages/apia/login.js
export const prerender = false;

import PocketBase from "pocketbase";

// Nom de la collection d'auth PB (auth collection)
const AUTH_COLLECTION =
  (import.meta.env.PUBLIC_PB_AUTH_COLLECTION ?? "").trim() || "users";

// Helper JSON
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export async function POST({ request, cookies }) {
  try {
    // Base URL de PB : d'abord l'env PUBLIC_PB_URL, sinon l'origine de la requête
    // (ex: https://sae301.alexandre-demling.fr). Le SDK ajoutera /api tout seul.
    const origin = new URL(request.url).origin;
    const baseUrl =
      (import.meta.env.PUBLIC_PB_URL ?? "").trim() || origin;

    const { email, identifier, password } = await request.json().catch(() => ({}));
    const id = identifier ?? email;
    if (!id || !password) return json({ error: "Missing credentials" }, 400);

    const pb = new PocketBase(baseUrl);
    pb.autoCancellation(false);
    pb.authStore.clear();

    // Auth PB en ligne (email ou username)
    await pb.collection(AUTH_COLLECTION).authWithPassword(id, password);

    // Déposer le cookie pb_auth depuis l'authStore
    const header = pb.authStore.exportToCookie({
      httpOnly: true,
      secure: true,      // en ligne = HTTPS
      sameSite: "Lax",
      path: "/",
    });
    const m = header.match(/pb_auth=([^;]+)/);
    if (!m) return json({ error: "Auth cookie error" }, 500);

    cookies.set("pb_auth", m[1], {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      path: "/",
    });

    const user = pb.authStore.model ?? pb.authStore.record ?? null;
    return json({ user }, 200);
  } catch (err) {
    return json(
      { error: err?.data?.message || err?.message || "Failed to authenticate." },
      401
    );
  }
}
