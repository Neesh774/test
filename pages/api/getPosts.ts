import { SupabaseClient } from "@supabase/supabase-js";
import { NextApiHandler } from "next";
import Cors from 'cors'
import runMiddleware from "@/utils/runMiddleware";

const cors = Cors({
  methods: ['POST'],
})

const getPosts: NextApiHandler = async (req, res) => {
  await runMiddleware(req, res, cors)
  const client = new SupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.SUPABASE_SERVICE_KEY as string);
  const { data, error } = await client.from("posts").select("*");

  if (error) {
    res.status(500).json({ message: "Internal server error", error, data: null });
    return;
  }

  res.status(200).json({ data, message: "Success", error: null });
}

export default getPosts;