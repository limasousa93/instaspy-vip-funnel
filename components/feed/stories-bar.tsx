"use client";

import Image from "next/image";
import { mockStories } from "@/lib/mock-data/stories";
import { getUser, avatarUrl } from "@/lib/mock-data/users";

export function StoriesBar() {
  return (
    <div className="flex gap-4 overflow-x-auto border-b border-border px-4 py-4 lg:px-0">
      {mockStories.map((story) => {
        const user = getUser(story.authorId);
        return (
          <div key={story.id} className="flex w-16 shrink-0 flex-col items-center gap-1">
            <div className={`rounded-full p-[2px] ${story.seen ? "bg-muted" : "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600"}`}>
              <div className="rounded-full bg-background p-[2px]">
                <Image src={avatarUrl(user.id)} alt={user.username} width={56} height={56} className="rounded-full" />
              </div>
            </div>
            <span className="w-full truncate text-center text-xs text-muted-foreground">{story.label}</span>
          </div>
        );
      })}
    </div>
  );
}
