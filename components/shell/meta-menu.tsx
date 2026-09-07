"use client";

import { Bot, Grid3x3, MessageSquare, AtSign } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function MetaMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-4 rounded-lg px-3 py-3 text-left text-base text-muted-foreground hover:bg-accent">
        <Grid3x3 className="h-6 w-6" /> Também da Meta
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end" className="w-56">
        <DropdownMenuItem><Bot className="mr-2 h-4 w-4" /> Meta AI</DropdownMenuItem>
        <DropdownMenuItem><Grid3x3 className="mr-2 h-4 w-4" /> AI Studio</DropdownMenuItem>
        <DropdownMenuItem><MessageSquare className="mr-2 h-4 w-4" /> WhatsApp</DropdownMenuItem>
        <DropdownMenuItem><AtSign className="mr-2 h-4 w-4" /> Threads</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
