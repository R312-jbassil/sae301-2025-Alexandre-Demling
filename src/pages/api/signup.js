// ❗ Obligatoire si ton projet n'est pas en `output: 'server'`
export const prerender = false;

import pb, { exportAuthCookie } from "../utils/pb.ts";

export async function POST({ request, cookies }) {
  // Vérifie le Content-Type et parse proprement
  const ct = request.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    return new Response(JSON.stringify({ error: "Use Content-Type: application/json" }), { status: 400 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  const { email, password, first, last } = body || {};
  if (!email || !password) {
    return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
  }

  try {
    // 1) création user dans la collection d'auth 'users'
    await pb.collection("users").create({
      email,
      password,
      passwordConfirm: password,
      name: `${first ?? ""} ${last ?? ""}`.trim(),
    });

    // 2) login immédiat
    await pb.collection("users").authWithPassword(email, password);

    // 3) cookie httpOnly
    cookies.set("pb_auth", exportAuthCookie(), {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      secure: import.meta.env.PROD,
    });

    return new Response(JSON.stringify({ user: pb.authStore.model }), { status: 200 });
  } catch (err) {
    console.error(err);
    // Email déjà pris, mot de passe trop court, etc.
    return new Response(JSON.stringify({ error: "Signup failed" }), { status: 400 });
  }
}
