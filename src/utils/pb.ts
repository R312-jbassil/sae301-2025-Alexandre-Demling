// src/utils/pb.ts
import PocketBase from "pocketbase";

const isDev = (import.meta as any).env?.MODE === "development";

// Permet une surcharge via variables d'env si besoin
const envUrl =
  (import.meta as any).env?.PUBLIC_PB_URL ||
  (import.meta as any).env?.PB_URL;

const baseUrl = envUrl
  ? envUrl
  : isDev
  ? "http://127.0.0.1:8090"              // machine de dev
  : "https://sae301.alexandre-demling.fr:443"; // URL publique (Apache proxy vers PB 8096)

/** Instance PocketBase partagée (OK si tu ne fais pas d'auth multi-utilisateurs côté SSR).
 *  Si tu fais du SSR avec sessions, préfère créer une instance par requête. */
const pb = new PocketBase(baseUrl);

// --- Helpers cookies (inchangés sauf secure basé sur PROD) ---

// Charge l'auth depuis un header "Cookie" (ex: "pb_auth=...; other=...")
export function loadAuthFromCookie(cookieHeader: string) {
  if (cookieHeader) {
    pb.authStore.loadFromCookie(cookieHeader, "pb_auth");
  }
}

// Exporte UNIQUEMENT la valeur de pb_auth (utile pour Astro cookies.set)
export function exportAuthCookieValue() {
  const header = pb.authStore.exportToCookie({
    httpOnly: true,
    secure: !(isDev),   // secure en prod
    sameSite: "Strict",
    path: "/",
  });
  const m = header.match(/pb_auth=([^;]+)/);
  return m ? m[1] : "";
}

export default pb;
