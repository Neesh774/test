export default function getMediaURL(name: string, id: string) {
  return process.env.NEXT_PUBLIC_SUPABASE_URL + "/storage/v1/object/public/post-media/" + id + "/" + name;
}