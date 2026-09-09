"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function UsernameSearchBar() {
  const router = useRouter();
  const [value, setValue] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const username = value.trim().replace(/^@/, "");
    if (!username) return;
    router.push(`/${encodeURIComponent(username)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm items-center gap-2">
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Buscar por @username"
        aria-label="Username do Instagram"
      />
      <Button type="submit" disabled={!value.trim()}>
        <Search />
        Buscar
      </Button>
    </form>
  );
}
