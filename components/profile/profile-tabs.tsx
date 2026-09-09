"use client";

import Image from "next/image";
import Link from "next/link";
import { PlayCircle, Copy, SquarePlay, Repeat, SquareUser } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Post, Reel } from "@/lib/types";

function GridDotsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      {[1, 9, 17].flatMap((y) =>
        [1, 9, 17].map((x) => <rect key={`${x}-${y}`} x={x} y={y} width={6} height={6} rx={2.25} />)
      )}
    </svg>
  );
}

export function ProfileTabs({
  posts,
  reels,
  reposts,
  tagged,
}: {
  posts: Post[];
  reels: Reel[];
  reposts: Reel[];
  tagged: Post[];
}) {
  return (
    <Tabs defaultValue="posts">
      <TabsList variant="line" className="h-auto w-full justify-center gap-0 border-t border-border p-0">
        <TabsTrigger value="posts" className="h-auto flex-1 rounded-none py-3 text-foreground/50 data-active:text-foreground">
          <GridDotsIcon className="h-8 w-8" />
        </TabsTrigger>
        <TabsTrigger value="reels" className="h-auto flex-1 rounded-none py-3 text-foreground/50 data-active:text-foreground">
          <SquarePlay className="h-8 w-8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </TabsTrigger>
        <TabsTrigger value="reposts" className="h-auto flex-1 rounded-none py-3 text-foreground/50 data-active:text-foreground">
          <Repeat className="h-8 w-8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </TabsTrigger>
        <TabsTrigger value="tagged" className="h-auto flex-1 rounded-none py-3 text-foreground/50 data-active:text-foreground">
          <SquareUser className="h-8 w-8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </TabsTrigger>
      </TabsList>
      <TabsContent value="posts" className="grid grid-cols-3 gap-0.5">
        {posts.map((post) => (
          <div key={post.id} className="relative aspect-square bg-muted active:opacity-80">
            <Image src={post.images[0]} alt={post.caption} fill sizes="33vw" className="object-cover" />
            {post.images.length > 1 && (
              <Copy className="absolute right-1.5 top-1.5 h-4 w-4 fill-white text-white drop-shadow" />
            )}
          </div>
        ))}
      </TabsContent>
      <TabsContent value="reels" className="grid grid-cols-3 gap-0.5">
        {reels.map((reel) => (
          <Link key={reel.id} href={`/reels?r=${reel.id}`} className="relative aspect-square bg-muted active:opacity-80">
            <Image src={reel.videoThumb} alt={reel.caption} fill sizes="33vw" className="object-cover" />
            <PlayCircle className="absolute right-1.5 top-1.5 h-4 w-4 fill-white text-white drop-shadow" />
          </Link>
        ))}
      </TabsContent>
      <TabsContent value="reposts" className="grid grid-cols-3 gap-0.5">
        {reposts.map((reel) => (
          <Link key={reel.id} href={`/reels?r=${reel.id}`} className="relative aspect-square bg-muted active:opacity-80">
            <Image src={reel.videoThumb} alt={reel.caption} fill sizes="33vw" className="object-cover" />
            <PlayCircle className="absolute right-1.5 top-1.5 h-4 w-4 fill-white text-white drop-shadow" />
          </Link>
        ))}
        {reposts.length === 0 && (
          <p className="col-span-3 py-10 text-center text-sm text-muted-foreground">Nenhuma repostagem ainda.</p>
        )}
      </TabsContent>
      <TabsContent value="tagged" className="grid grid-cols-3 gap-0.5">
        {tagged.map((post) => (
          <div key={post.id} className="relative aspect-square bg-muted active:opacity-80">
            <Image src={post.images[0]} alt={post.caption} fill sizes="33vw" className="object-cover" />
          </div>
        ))}
        {tagged.length === 0 && (
          <p className="col-span-3 py-10 text-center text-sm text-muted-foreground">Nenhuma foto marcada ainda.</p>
        )}
      </TabsContent>
    </Tabs>
  );
}
