'use client';

import { ChevronDown, Archive, Users, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FamilyGroup } from '@/types';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string;
  families: FamilyGroup[];
  selectedFamilyId: string | null;
  onSelectFamily: (id: string) => void;
  onOpenArchive: () => void;
  onOpenFamilyManager: () => void;
  showArchive?: boolean;
  showFamilySelector?: boolean;
  isDark?: boolean;
}

export function Header({
  title,
  families,
  selectedFamilyId,
  onSelectFamily,
  onOpenArchive,
  onOpenFamilyManager,
  showArchive = false,
  showFamilySelector = false,
  isDark = false,
}: HeaderProps) {
  const selectedFamily = families.find((f) => f.id === selectedFamilyId);

  return (
    <header className={cn(
      "sticky top-0 backdrop-blur-sm border-b z-40 safe-top transition-colors duration-300",
      isDark 
        ? "bg-black/95 border-gray-800" 
        : "bg-white/95 border-gray-100"
    )}>
      <div className="max-w-lg mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Family Selector or Title */}
          <div className="flex items-center gap-2 min-w-0">
            {showFamilySelector && families.length > 0 ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex items-center gap-2 text-lg font-semibold px-2 h-11",
                      isDark ? "text-white hover:bg-white/10" : "text-gray-900 hover:bg-gray-100"
                    )}
                  >
                    <Users className={cn("w-5 h-5 flex-shrink-0", isDark ? "text-white" : "text-blue-500")} />
                    <span className="truncate">{selectedFamily?.name || 'Выберите семью'}</span>
                    <ChevronDown className={cn("w-4 h-4 flex-shrink-0", isDark ? "text-gray-400" : "text-gray-400")} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {families.map((family) => (
                    <DropdownMenuItem
                      key={family.id}
                      onClick={() => onSelectFamily(family.id)}
                      className="cursor-pointer"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      {family.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <h1 className={cn("text-xl font-bold truncate", isDark ? "text-white" : "text-gray-900")}>{title}</h1>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {showFamilySelector && (
              <Button
                variant={isDark ? "ghost" : "outline"}
                size="sm"
                onClick={onOpenFamilyManager}
                className={cn(
                  "h-9 px-3 text-sm font-medium",
                  isDark 
                    ? "text-white hover:bg-white/10 border-white/20" 
                    : ""
                )}
              >
                <Settings className="w-4 h-4 mr-1" />
                Настройки
              </Button>
            )}
            {showArchive && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onOpenArchive}
                className={cn(
                  "h-11 w-11",
                  isDark 
                    ? "text-gray-400 hover:text-white hover:bg-white/10" 
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                <Archive className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
