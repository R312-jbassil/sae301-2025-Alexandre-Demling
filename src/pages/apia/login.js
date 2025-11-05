// src/pages/api/login.js
export const prerender = false;

import pb, { exportAuthCookieValue } from "../../utils/pb.ts";

/**
 * POST /api/login
 * Body JSON: { "email": "ou-username", "password": "..." }
 * - "email" peut être un email OU un username (PocketBase accepte les deux)
 */
export async function POST({ request, cookies }) {
  try {
    const data = await request.json().catch(() => null);
    const { email, identifier, password } = data || {};
    const idOrEmail = identifier ?? email;

    if (!idOrEmail || !password) {
      return json({ error: "Missing credentials" }, 400);
    }

    // Auth sur la collection d’auth "users"
    await pb.collection("users").authWithPassword(idOrEmail, password);

    // Dépose le cookie pb_auth (valeur uniquement)
    const value = exportAuthCookieValue();
    if (!value) {
      return json({ error: "Auth cookie error" }, 500);
    }

    cookies.set("pb_auth", value, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      secure: import.meta.env.PROD,
    });

    const user = pb.authStore.model ?? pb.authStore.record ?? null;
    return json({ user }, 200);
  } catch (err) {
    const message =
      err?.data?.message || err?.message || "Invalid credentials";
    return json({ error: message }, 401);
  }
}

// Petit helper de réponse JSON
function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
