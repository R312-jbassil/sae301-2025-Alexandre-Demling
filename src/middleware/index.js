// src/middleware/index.js
import PocketBase from "pocketbase";

export const onRequest = async (context, next) => {
  const { url, cookies, locals } = context;

  // --- 1) Recrée une instance PB pour CETTE requête
  const pb = new PocketBase(import.meta.env.PUBLIC_PB_URL ?? "http://127.0.0.1:8090");

  // --- 2) Charge l'auth depuis le cookie httpOnly
  const cookieVal = cookies.get("pb_auth")?.value;
  if (cookieVal) {
    // loadFromCookie attend un header "Cookie" complet : "pb_auth=...."
    pb.authStore.loadFromCookie(`pb_auth=${cookieVal}`, "pb_auth");
  }

  // --- 3) S'il est valide, expose l'utilisateur à la suite du pipeline
  if (pb.authStore.isValid) {
    locals.user = pb.authStore.model ?? pb.authStore.record;
  }

  // --- 4) Routes publiques / protégées
  const isPublic =
    url.pathname === "/" ||
    url.pathname === "/login" ||
    url.pathname === "/signup" ||
    url.pathname === "/accueil" ||
    url.pathname.startsWith("/api/login") ||
    url.pathname.startsWith("/api/signup");

  const needsAuth =
    url.pathname.startsWith("/configurateur") ||
    url.pathname.startsWith("/mes-lunettes") ||
    url.pathname.startsWith("/api/lunettes") ||
    url.pathname.startsWith("/api/logout");

  if (needsAuth && !locals.user && !isPublic) {
    const to = new URL("/connexion-requise", url);
    to.searchParams.set("redirect", url.pathname + url.search);
    return Response.redirect(to, 303);
  }

  return next();
};
