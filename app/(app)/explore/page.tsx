import { Search } from "lucide-react";
import { ExploreGrid } from "@/components/explore/explore-grid";

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-5xl px-2 py-4 lg:px-6">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Pesquisar"
          className="w-full rounded-md bg-secondary py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>
      <ExploreGrid />
    </div>
  );
}
