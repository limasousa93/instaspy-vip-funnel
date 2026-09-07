"use client";

import Image from "next/image";
import { mockStories } from "@/lib/mock-data/stories";
import { getUser, avatarUrl } from "@/lib/mock-data/users";

export function StoriesBar() {
  return (
    <div className="no-scrollbar momentum-scroll flex gap-4 overflow-x-auto border-b border-border px-4 py-4 lg:px-0">
      {mockStories.map((story) => {
        const user = getUser(story.authorId);
        return (
          <button key={story.id} className="flex w-16 shrink-0 flex-col items-center gap-1 active:opacity-60">
            <div
              className={`rounded-full p-[2px] ${story.seen ? "bg-muted" : ""}`}
              style={story.seen ? undefined : { backgroundImage: "linear-gradient(45deg, #fbbf24, #ec4899, #9333ea)" }}
            >
              <div className="rounded-full bg-background p-[2px]">
                <Image src={avatarUrl(user.id)} alt={user.username} width={56} height={56} className="rounded-full" />
              </div>
            </div>
            <span className="w-full truncate text-center text-xs text-muted-foreground">{story.label}</span>
          </button>
        );
      })}
    </div>
  );
}
