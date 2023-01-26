import { SupabaseClient } from "@supabase/supabase-js";
import { NextApiHandler } from "next";
import { z } from "zod";
import Cors from 'cors'
import runMiddleware from "@/utils/runMiddleware";
const cors = Cors({
  methods: ['POST'],
})

const getOrCreateBuilder: NextApiHandler = async (req, res) => {
  await runMiddleware(req, res, cors)

  const builderSchema = z.object({
    username: z.string().max(32),
    discord_id: z.string().length(18),
  })

  const object = builderSchema.safeParse(req.body);

  if (!object.success) {
    res.status(400).json({ message: "Invalid request body", error: object.error, data: null });
    return;
  }
  const { username, discord_id } = object.data;

  const client = new SupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.SUPABASE_SERVICE_KEY as string);

  const { data, error } = await client.from("builders").upsert({ username, discord_id }).select().single();

  if (error) {
    res.status(500).json({ message: "Internal server error", error, data: null });
    console.error(error)
    return;
  }
  res.status(200).json({ data, message: "Success", error: null });
}

export default getOrCreateBuilder;