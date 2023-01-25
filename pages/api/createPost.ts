import { SupabaseClient } from "@supabase/supabase-js";
import { NextApiHandler } from "next";
import { z } from "zod";

// expects a request body of { description: string, builder: string, tags: string[] }
// returns a 201 with the new post object on success
const createPost: NextApiHandler = async (req, res) => {
  const postSchema = z.object({
    description: z.string(),
    builder: z.string(),
    tags: z.array(z.string()),
  })

  const object = postSchema.safeParse(req.body);

  if (!object.success) {
    res.status(400).json({ message: "Invalid request body" });
    return;
  }
  const { description, builder, tags } = object.data;

  const client = new SupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.SUPABASE_SERVICE_KEY as string);
  const { data, error } = await client.from("posts").insert({ description, builder, tags });

  if (error) {
    res.status(500).json({ message: "Internal server error" });
    return;
  }
  res.status(201).json({ data });
}

export default createPost;