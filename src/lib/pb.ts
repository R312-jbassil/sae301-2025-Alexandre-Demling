import PocketBase from "pocketbase";

const pb = new PocketBase(import.meta.env.PUBLIC_PB_URL);

// utilitaires cookie <-> authStore
export function loadAuthFromCookie(cookieStr?: string) {
  if (cookieStr) pb.authStore.loadFromCookie(cookieStr);
  return pb;
}
export function exportAuthCookie() {
  // httpOnly côté API (middleware posera les options)
  return pb.authStore.exportToCookie();
}

export default pb;
