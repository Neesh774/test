export type DatabaseBuilder = {
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
  content: string;
  title: string;
  builder: DatabaseBuilder;
  tags: string[];
  media: string[];
}

export type NewPost = {
  title: string;
  content: string;
  builder: string;
  tags: string[];
}