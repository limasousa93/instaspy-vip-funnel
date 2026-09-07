"use client";

import Image from "next/image";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { mockNotifications } from "@/lib/mock-data/notifications";
import { getUser, avatarUrl } from "@/lib/mock-data/users";
import { useInteractions } from "@/lib/context/interactions-context";

const GROUP_LABEL: Record<string, string> = { today: "Hoje", week: "Esta semana", month: "Este mês" };

export function NotificationsPanel({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { isFollowing, toggleFollow } = useInteractions();
  const groups = ["today", "week", "month"] as const;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full border-border bg-background p-0 sm:w-96">
        <SheetHeader className="border-b border-border px-4 py-4">
          <SheetTitle className="text-foreground">Notificações</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto px-4 py-3">
          {groups.map((group) => {
            const items = mockNotifications.filter((n) => n.group === group);
            if (items.length === 0) return null;
            return (
              <div key={group} className="mb-4">
                <h3 className="mb-2 text-sm font-semibold text-foreground">{GROUP_LABEL[group]}</h3>
                <div className="space-y-3">
                  {items.map((n) => {
                    const user = getUser(n.userId);
                    return (
                      <div key={n.id} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Image src={avatarUrl(user.id)} alt={user.username} width={40} height={40} className="rounded-full" />
                          <p className="text-sm text-foreground">
                            <span className="font-semibold">{user.username}</span> {n.text}{" "}
                            <span className="text-muted-foreground">{n.timeAgo}</span>
                          </p>
                        </div>
                        {n.actionable === "follow-back" && (
                          <button
                            onClick={() => toggleFollow(user.id)}
                            className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold ${
                              isFollowing(user.id) ? "bg-secondary text-foreground" : "bg-primary text-primary-foreground"
                            }`}
                          >
                            {isFollowing(user.id) ? "Seguindo de volta" : "Seguir de volta"}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
