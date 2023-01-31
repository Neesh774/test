import { SupabaseClient } from "@supabase/supabase-js";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { string, z } from "zod";
import Cors from 'cors'
import runMiddleware from "@/utils/runMiddleware";
import { decode } from 'base64-arraybuffer'

const cors = Cors({
  methods: ['POST'],
})


// upload media(images, videos) to supabase storage for a post
const uploadPostMedia: NextApiHandler = async (req, res) => {
  await runMiddleware(req, res, cors)

  const mediaSchema = z.object({
    mediaURLs: z.array(z.string()),
    post_id: z.string(),
  })

  const object = mediaSchema.safeParse(req.body);

  if (!object.success) {
    res.status(400).json({ message: "Invalid request body", error: object.error, date: null });
    return;
  }
  const { mediaURLs, post_id } = object.data;

  const client = new SupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.SUPABASE_SERVICE_KEY as string);
  const fileNames = await Promise.all(mediaURLs.map(async (mediaURL) => {
    const fileName = mediaURL.split('/').pop() as string;
    const blob = await fetch(mediaURL).then(r => r.blob())
    const { data, error } = await client.storage.from('post-media').upload(`${post_id}/${fileName}`, blob, {
      contentType: blob.type,
    });
    if (error) {
      res.status(500).json({ message: "Internal server error", error, data: null });
      return;
    }
    return fileName;
  }))

  await client.from("posts").update({ media: fileNames }).eq("id", post_id);

  res.status(200).json({ message: "Success", error: null, data: fileNames });
}

export default uploadPostMedia;