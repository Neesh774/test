export type DatabaseBuilder = {
  id: string;
  created_at: string;
  username: string
  discord_id: string;
}

export type NewBuilder = {
  username: string;
  discord_id: string;
}

export type DatabasePost = {
  id: string;
  created_at: string;
  description: string;
  builder: DatabaseBuilder;
  tags: string[];
}

export type NewPost = {
  description: string;
  builder: string;
  tags: string[];
}