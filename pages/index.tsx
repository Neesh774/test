import { DatabaseBuilder, DatabasePost } from "@/utils/types";
import { Loader2 } from "lucide-react";
import { GetStaticProps } from "next";
import { useEffect, useState } from "react";

export default function Home() {
  const [posts, setPosts] = useState<DatabasePost[]>();

  useEffect(() => {
    fetch("/api/getPosts")
      .then((res) => res.json())
      .then((data: { data: DatabasePost[] }) => setPosts(data.data));
  }, []);
  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts ? (
          posts.map((post) => (
            <li key={post.id}>
              <a href={`/posts/${post.id}`}>{post.description}</a>
            </li>
          ))
        ) : (
          <div className="animate-spin w-8 h-8 flex items-center justify-center">
            <Loader2 />
          </div>
        )}
      </ul>
    </div>
  );
}
