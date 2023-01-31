import getMediaURL from "@/utils/getMediaURL";
import parseLinks from "@/utils/parseLinks";
import { DatabasePost } from "@/utils/types";
import { useEffect, useState } from "react";

export default function Post({
  post,
  index,
}: {
  post: DatabasePost;
  index: number;
}) {
  const mediaURLs = post.media?.map((p) => getMediaURL(p, post.id)) || [];

  return (
    <div
      className="h-fit my-1 rounded-md opacity-0 bg-blue-800/10 border-blue-700/20 border-2 p-4 text-white animate-fade-in-up"
      style={{
        animationDelay: `${index * 0.05}s`,
      }}
    >
      <div className="flex flex-row items-center">
        <h3 className="font-urbanist font-semibold">{post.builder.username}</h3>
      </div>
      <h1 className="text-lg font-jakarta font-semibold">{post.title} </h1>
      <p
        className="font-urbanist text-zinc-400 font-medium break-word"
        dangerouslySetInnerHTML={{ __html: parseLinks(post.content) }}
      />
      {post.media && post.media.length > 0 && (
        <div className="relative w-full rounded-md h-fit mt-4">
          {mediaURLs[0].endsWith(".jpg") || mediaURLs[0].endsWith(".png") ? (
            <img
              src={mediaURLs[0]}
              className="w-full h-full rounded-md object-cover"
            />
          ) : (
            <video
              src={mediaURLs[0]}
              className="w-full h-full rounded-md object-cover"
              controls
            />
          )}
        </div>
      )}
    </div>
  );
}
