// ❗ Obligatoire si ton projet n'est pas en `output: 'server'`
export const prerender = false;

import pb from "../utils/pb.ts";

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
    // 1️⃣ Création utilisateur
    await pb.collection("users").create({
      email,
      password,
      passwordConfirm: password,
      name: `${first ?? ""} ${last ?? ""}`.trim(),
    });

    // 2️⃣ Connexion immédiate
    await pb.collection("users").authWithPassword(email, password);

    // 3️⃣ Création du cookie d’auth httpOnly
    const cookieStr = pb.authStore.exportToCookie({
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: "strict",
    });

    // On découpe le cookie pour en extraire nom/valeur
    const [, name, value] = cookieStr.match(/^(.*?)=(.*?);/) || [];
    cookies.set(name || "pb_auth", value || "", {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      secure: import.meta.env.PROD,
    });

    // 4️⃣ Retour
    return new Response(JSON.stringify({ user: pb.authStore.model }), { status: 200 });
  } catch (err) {
    console.error("Signup failed:", err);
    const msg = err?.data?.message || err?.message || "Signup failed";
    return new Response(JSON.stringify({ error: msg }), { status: 400 });
  }
}
