"use client";

import { Bell, Check, ChevronDown, LogOut, PanelLeft, User } from "lucide-react";
import { OwnerAvatar } from "@/components/badges/OwnerAvatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { currentTenant, notifications } from "@/data/users";
import { useSidebar } from "@/context/SidebarContext";
import { usePersona } from "@/hooks/usePersona";
import { formatRelative } from "@/lib/format";
import { personaToOwner } from "@/data/personas";

export function TopBar() {
  const { persona, personas, setPersonaId } = usePersona();
  const { open, setOpen } = useSidebar();
  const unread = notifications.filter((item) => !item.read).length;
  const owner = personaToOwner(persona);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-neutral-200 bg-white/90 px-4 backdrop-blur sm:px-6">
      <div className="mx-auto flex w-full max-w-[1440px] items-center gap-3">
        {!open && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setOpen(true)}
                aria-label="Show sidebar"
              >
                <PanelLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Show sidebar</TooltipContent>
          </Tooltip>
        )}

        <div className="flex-1" />

        <Badge
          variant="muted"
          className="hidden h-9 items-center gap-1.5 px-3 text-sm sm:inline-flex"
          title="Tenant is fixed for this session. Users cannot switch cities."
        >
          <span className="font-normal text-neutral-500">Tenant:</span>
          <span>{currentTenant.name}</span>
        </Badge>

        <Badge
          variant="muted"
          className="hidden h-9 items-center gap-1.5 px-3 text-sm sm:inline-flex"
          title="Team is set by your account. Access is isolated per department."
        >
          <span className="font-normal text-neutral-500">Department:</span>
          <span>{persona.team}</span>
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unread > 0 ? (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
              ) : null}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((item) => (
              <DropdownMenuItem
                key={item.id}
                className="flex flex-col items-start gap-0.5 py-2"
              >
                <span className="text-sm font-medium text-neutral-900">
                  {item.title}
                </span>
                <span className="text-xs text-neutral-500">
                  {item.description}
                </span>
                <span className="text-[11px] text-neutral-400">
                  {formatRelative(item.timestamp)}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-2 px-2">
              <OwnerAvatar owner={owner} showName={false} />
              <div className="hidden min-w-0 text-left lg:block">
                <p className="truncate text-sm font-medium text-neutral-800">
                  {persona.name}
                </p>
                <p className="truncate text-[11px] text-neutral-500">
                  {persona.title}
                </p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{persona.name}</span>
                <span className="font-normal text-neutral-500">
                  {persona.title}
                </span>
                <span className="font-normal text-neutral-500">
                  {persona.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Switch persona</DropdownMenuLabel>
            {personas.map((item) => (
              <DropdownMenuItem
                key={item.id}
                onClick={() => setPersonaId(item.id)}
                className="flex items-start gap-2 py-2"
              >
                <OwnerAvatar owner={personaToOwner(item)} showName={false} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-neutral-900">
                    {item.name}
                  </p>
                  <p className="text-xs text-neutral-500">{item.title}</p>
                </div>
                {item.id === persona.id ? (
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-neutral-900" />
                ) : null}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
