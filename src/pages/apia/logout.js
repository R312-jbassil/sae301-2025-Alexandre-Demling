import pb from "../utils/pb.ts";

export async function POST({ cookies }) {
  pb.authStore.clear();
  cookies.delete("pb_auth", { path: "/" });
  return new Response(null, { status: 204 });
}
