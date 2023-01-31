import { SupabaseClient } from "@supabase/supabase-js";
import { NextApiHandler } from "next";
import { z } from "zod";
import runMiddleware from "@/utils/runMiddleware";
import Cors from 'cors'

const cors = Cors({
  methods: ['POST'],
})

const getPostMedia: NextApiHandler = async (req, res) => {
  await runMiddleware(req, res, cors)
  const builderIdSchema = z.object({
    id: z.string(),
  })

  const object = builderIdSchema.safeParse(req.body);

  if (!object.success) {
    res.status(400).json({ message: "Invalid request body", error: object.error, data: null });
    return;
  }
  const { id } = object.data;

  const client = new SupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.SUPABASE_SERVICE_KEY as string);

  const { data, error } = await client.storage.from("post-media").list(id);


  if (error) {
    res.status(500).json({ message: "Internal server error", error, data: null });
    return;
  }

  const files = data.map((file) => {
    const { data } = client.storage.from("post-media").getPublicUrl(id + "/" + file.name);
    return data.publicUrl;
  })

  res.status(200).json({ data: files, message: "Success", error: null });
}

export default getPostMedia;