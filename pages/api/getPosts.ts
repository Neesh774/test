import { SupabaseClient } from "@supabase/supabase-js";
import { NextApiHandler } from "next";
import Cors from 'cors'
import runMiddleware from "@/utils/runMiddleware";
import { z } from "zod";

const cors = Cors({
  methods: ['POST'],
})

const getPosts: NextApiHandler = async (req, res) => {
  await runMiddleware(req, res, cors)

  const bodySchema = z.object({
    page_size: z.number().max(50).optional(),
    before: z.string().optional(),
  })

  const object = bodySchema.safeParse(req.body)
  if (!object.success) {
    res.status(400).json({ message: "Invalid request body", error: object.error, data: null });
    return;
  }
  const { page_size, before } = object.data;
  const pageSize = page_size || 10;
  const beforeDate = before ? new Date(before) : new Date();

  const client = new SupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.SUPABASE_SERVICE_KEY as string);
  const { data, error } = await client.from("posts").select(`
    *,
    builder (*)
  `).order("created_at", { ascending: false }).lte("created_at", beforeDate.toISOString()).limit(pageSize);

  if (error) {
    res.status(500).json({ message: "Internal server error", error, data: null });
    return;
  }


  res.status(200).json({
    data: {
      posts: data,
      before: data.length > 0 ? data[data.length - 1].created_at : null,
      page_size: pageSize,
      next_page: data.length === pageSize ? data[data.length - 1].created_at : null,
      has_next_page: data.length === pageSize,
    }, message: "Success", error: null
  });
}

export default getPosts;