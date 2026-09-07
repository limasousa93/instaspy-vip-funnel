"use client";

import type { ReactElement } from "react";
import { Settings, Activity, Bookmark, RefreshCw, Flag, Repeat, LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/context/auth-context";

export function MoreMenu({ trigger }: { trigger: ReactElement }) {
  const { logout } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={trigger} />
      <DropdownMenuContent side="right" align="end" className="w-64">
        <DropdownMenuItem><Settings className="mr-2 h-4 w-4" /> Configurações</DropdownMenuItem>
        <DropdownMenuItem><Activity className="mr-2 h-4 w-4" /> Sua atividade</DropdownMenuItem>
        <DropdownMenuItem><Bookmark className="mr-2 h-4 w-4" /> Salvos</DropdownMenuItem>
        <DropdownMenuItem><RefreshCw className="mr-2 h-4 w-4" /> Alternar exibição</DropdownMenuItem>
        <DropdownMenuItem><Flag className="mr-2 h-4 w-4" /> Relatar um problema</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem><Repeat className="mr-2 h-4 w-4" /> Trocar de conta</DropdownMenuItem>
        <DropdownMenuItem onClick={logout}><LogOut className="mr-2 h-4 w-4" /> Sair</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
