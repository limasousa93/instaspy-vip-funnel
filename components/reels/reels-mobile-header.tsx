import { Plus } from "lucide-react";
import { BlurredAvatar } from "@/components/ui/blurred-avatar";
import { avatarUrl } from "@/lib/media";

const FRIEND_AVATAR_SEEDS = ["reels-friend-1", "reels-friend-2", "reels-friend-3"];

export function ReelsMobileHeader() {
  return (
    <header
      className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-4 py-3 pb-6 lg:hidden"
      style={{ backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.55), transparent)" }}
    >
      <button className="active:opacity-40" aria-label="Criar reel">
        <Plus className="h-6 w-6 text-white" strokeWidth={2} />
      </button>
      <div className="flex items-center gap-4">
        <span className="text-base font-semibold text-white">Reels</span>
        <div className="flex items-center gap-1.5">
          <span className="text-base font-semibold text-white/50">Amigos</span>
          <div className="flex -space-x-2">
            {FRIEND_AVATAR_SEEDS.map((seed) => (
              <BlurredAvatar key={seed} src={avatarUrl(seed)} alt="" size={22} className="ring-2 ring-black" />
            ))}
          </div>
        </div>
      </div>
      <div className="w-6" aria-hidden="true" />
    </header>
  );
}
