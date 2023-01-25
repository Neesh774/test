import { SupabaseClient } from "@supabase/supabase-js";
import { NextApiHandler } from "next";
import { z } from "zod";
import Cors from 'cors'
import runMiddleware from "@/utils/runMiddleware";
const cors = Cors({
  methods: ['POST'],
})

// expects a request body of { username: string, discord_id: string }
// returns a 201 with the new builder object on success
const getOrCreateBuilder: NextApiHandler = async (req, res) => {
  await runMiddleware(req, res, cors)

  const builderSchema = z.object({
    username: z.string().max(32),
    discord_id: z.string().length(18),
  })

  const object = builderSchema.safeParse(req.body);

  if (!object.success) {
    res.status(400).json({ message: "Invalid request body" });
    return;
  }
  const { username, discord_id } = object.data;

  const client = new SupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.SUPABASE_SERVICE_KEY as string);

  const { data, error } = await client.from("builders").upsert({ username, discord_id }).select();

  if (error) {
    res.status(500).json({ message: "Internal server error", error });
    console.error(error)
    return;
  }
  res.status(201).json({ data });
}

export default getOrCreateBuilder;