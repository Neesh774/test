import { SupabaseClient } from "@supabase/supabase-js";
import { NextApiHandler } from "next";
import { z } from "zod";
import runMiddleware from "@/utils/runMiddleware";
import Cors from 'cors'

const cors = Cors({
  methods: ['POST'],
})

const getBuilder: NextApiHandler = async (req, res) => {
  await runMiddleware(req, res, cors)

  const builderIdSchema = z.object({
    discord_id: z.string(),
  })

  const object = builderIdSchema.safeParse(req.body);

  if (!object.success) {
    res.status(400).json({ message: "Invalid request body", error: object.error, data: null });
    return;
  }
  const { discord_id } = object.data;

  const client = new SupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.SUPABASE_SERVICE_KEY as string);

  const { data, error } = await client.from("builders").select("*").eq("discord_id", discord_id).single();

  if (error) {
    res.status(500).json({ message: "Internal server error", error, data: null });
    return;
  }

  res.status(200).json({ data, message: "Success", error: null });
}

export default getBuilder;