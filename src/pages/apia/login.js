// src/pages/apia/login.js
export const prerender = false;

import pb from "../../utils/pb.ts";

const AUTH_COLLECTION =
  (import.meta.env.PUBLIC_PB_AUTH_COLLECTION ?? "").trim() || "users";

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export async function POST({ request, cookies }) {
  try {
    const data = await request.json().catch(() => null);
    const { email, identifier, password } = data || {};
    const idOrEmail = identifier ?? email;
    if (!idOrEmail || !password) return json({ error: "Missing credentials" }, 400);

    // état propre et pas d’annulation auto
    pb.authStore.clear();
    pb.autoCancellation(false);

    // 👉 collection d'auth correcte (users)
    await pb.collection(AUTH_COLLECTION).authWithPassword(idOrEmail, password);

    // cookie pb_auth
    const header = pb.authStore.exportToCookie({
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: "Lax",
      path: "/",
    });
    const m = header.match(/pb_auth=([^;]+)/);
    const value = m?.[1] || "";
    if (!value) return json({ error: "Auth cookie error" }, 500);

    cookies.set("pb_auth", value, {
      httpOnly: true,
      secure: import.meta.env.PROD,
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
