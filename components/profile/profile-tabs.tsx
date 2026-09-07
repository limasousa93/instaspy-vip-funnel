"use client";

import Image from "next/image";
import { Grid3x3, Clapperboard, Bookmark } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Post, Reel } from "@/lib/types";

export function ProfileTabs({ posts, reels }: { posts: Post[]; reels: Reel[] }) {
  return (
    <Tabs defaultValue="posts">
      <TabsList className="w-full justify-center border-t border-border bg-transparent">
        <TabsTrigger value="posts"><Grid3x3 className="h-4 w-4" /></TabsTrigger>
        <TabsTrigger value="reels"><Clapperboard className="h-4 w-4" /></TabsTrigger>
        <TabsTrigger value="saved"><Bookmark className="h-4 w-4" /></TabsTrigger>
      </TabsList>
      <TabsContent value="posts" className="grid grid-cols-3 gap-1">
        {posts.map((post) => (
          <div key={post.id} className="relative aspect-square bg-muted">
            <Image src={post.images[0]} alt={post.caption} fill sizes="33vw" className="object-cover" />
          </div>
        ))}
      </TabsContent>
      <TabsContent value="reels" className="grid grid-cols-3 gap-1">
        {reels.map((reel) => (
          <div key={reel.id} className="relative aspect-square bg-muted">
            <Image src={reel.videoThumb} alt={reel.caption} fill sizes="33vw" className="object-cover" />
          </div>
        ))}
      </TabsContent>
      <TabsContent value="saved">
        <p className="py-10 text-center text-sm text-muted-foreground">Nenhum item salvo ainda.</p>
      </TabsContent>
    </Tabs>
  );
}
