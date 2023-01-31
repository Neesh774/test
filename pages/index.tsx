import Nav from "@/components/Nav";
import Post from "@/components/Post";
import { DatabasePost } from "@/utils/types";
import { Loader2 } from "lucide-react";
import { Masonry, useInfiniteLoader } from "masonic";
import { GetStaticProps } from "next";
import { useEffect, useState } from "react";
import { z } from "zod";

export default function Home() {
  const [posts, setPosts] = useState<DatabasePost[]>();
  const [next, setNext] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState<boolean>(true);

  const maybeLoadMore = useInfiniteLoader(
    async () => {
      if (!hasMore) return;
      const data = (await fetch("/api/getPosts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page_size: 20,
          before: next,
        }),
      }).then((res) => res.json())) as {
        data: {
          posts: DatabasePost[];
          next_page: string;
          has_next_page: boolean;
        };
        error: boolean;
        message: string;
      };

      setPosts((current) =>
        (current ?? [])
          .concat(data.data.posts)
          .filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i)
      );
      setHasMore(data.data.has_next_page);
      if (data.data.has_next_page) setNext(data.data.next_page);
    },
    {
      isItemLoaded: (index, items) => !!items[index],
      threshold: 10,
    }
  );

  useEffect(() => {
    fetch("/api/getPosts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page_size: 20,
      }),
    })
      .then((res) => res.json())
      .then(
        (data: {
          data: {
            posts: DatabasePost[];
            next_page: string;
            has_next_page: boolean;
          };
          error: boolean;
          message: string;
        }) => {
          if (!data.error) {
            setPosts(data.data.posts);
            setHasMore(data.data.has_next_page);
            if (data.data.has_next_page) setNext(data.data.next_page);
          } else {
            console.error("Error fetching posts: " + data.message);
            console.error(data.error);
          }
        }
      );
  }, []);

  return (
    <div className="w-full h-screen bg-slate-900 overflow-auto relative">
      <Nav />
      <div className="pt-28 mx-24">
        {posts && (
          <Masonry
            items={posts}
            render={({ data, index }) => <Post post={data} index={index} />}
            columnGutter={8}
            rowGutter={1}
            columnWidth={250}
            onRender={maybeLoadMore}
            ssrHeight={posts.length * 300}
          />
        )}
      </div>
    </div>
  );
}
