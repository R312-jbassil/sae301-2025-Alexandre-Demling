// src/utils/pb.ts
import PocketBase from "pocketbase";

const pb = new PocketBase(import.meta.env.PUBLIC_PB_URL);

export function loadAuthFromCookie(cookie: string) {
  pb.authStore.loadFromCookie(cookie);
}

export default pb;
