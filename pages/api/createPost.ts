import { SupabaseClient } from "@supabase/supabase-js";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { string, z } from "zod";
import Cors from 'cors'
import runMiddleware from "@/utils/runMiddleware";

const cors = Cors({
  methods: ['POST'],
})


const createPost: NextApiHandler = async (req, res) => {
  await runMiddleware(req, res, cors)
  const body = JSON.parse(req.body);

  const postSchema = z.object({
    content: z.string(),
    builder: z.string(),
    tags: z.array(z.string()),
    title: z.string(),
  })

  const object = postSchema.safeParse(body);

  if (!object.success) {
    res.status(400).json({ message: "Invalid request body", error: object.error });
    return;
  }
  const { title, content, builder, tags } = object.data;

  const client = new SupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.SUPABASE_SERVICE_KEY as string);
  const { data, error } = await client.from("posts").insert({ title, content, builder, tags }).select("*")

  if (error) {
    res.status(500).json({ message: "Internal server error", error });
    return;
  }
  res.status(201).json({ data });
}

export default createPost;