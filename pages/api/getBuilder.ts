import { SupabaseClient } from "@supabase/supabase-js";
import { NextApiHandler } from "next";
import { z } from "zod";
import runMiddleware from "@/utils/runMiddleware";
import Cors from 'cors'

const cors = Cors({
  methods: ['POST'],
})

// expects a request body of { discord_id: string }
// returns a 201 with the builder object on success
const getBuilder: NextApiHandler = async (req, res) => {
  await runMiddleware(req, res, cors)
  const builderIdSchema = z.object({
    discord_id: z.string(),
  })

  const object = builderIdSchema.safeParse(req.body);

  if (!object.success) {
    res.status(400).json({ message: "Invalid request body" });
    return;
  }
  const { discord_id } = object.data;

  const client = new SupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.SUPABASE_SERVICE_KEY as string);

  const { data, error } = await client.from("builders").select("*").eq("discord_id", discord_id).single();

  if (error) {
    res.status(500).json({ message: "Internal server error", error });
    return;
  }

  res.status(201).json({ data });
}

export default getBuilder;