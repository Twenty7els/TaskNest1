'use client';

import { useState } from 'react';
import { Search, UserPlus, X, Check } from 'lucide-react';
import { User as UserType } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface FriendSearchProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserType[];
  currentUserId: string;
  friendIds: string[];
  pendingRequestUserIds: string[];
  onSendRequest: (userId: string) => void;
}

export function FriendSearch({
  isOpen,
  onClose,
  users,
  currentUserId,
  friendIds,
  pendingRequestUserIds,
  onSendRequest,
}: FriendSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter users
  const filteredUsers = users.filter((user) => {
    if (user.id === currentUserId) return false;
    if (!searchQuery.trim()) return false;
    const query = searchQuery.toLowerCase().replace('@', '');
    return (
      user.username?.toLowerCase().includes(query) ||
      user.first_name.toLowerCase().includes(query) ||
      user.last_name?.toLowerCase().includes(query)
    );
  });

  const handleClose = () => {
    setSearchQuery('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Найти друзей</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Введите username или имя..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto space-y-2">
            {searchQuery.trim() && filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Пользователи не найдены</p>
                <p className="text-sm">Попробуйте другой запрос</p>
              </div>
            )}

            {filteredUsers.map((user) => {
              const isFriend = friendIds.includes(user.id);
              const hasPendingRequest = pendingRequestUserIds.includes(user.id);

              return (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.avatar_url || ''} />
                    <AvatarFallback>{user.first_name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                  </div>
                  {isFriend ? (
                    <span className="text-sm text-green-600 flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      Друг
                    </span>
                  ) : hasPendingRequest ? (
                    <span className="text-sm text-yellow-600">Запрос отправлен</span>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSendRequest(user.id)}
                    >
                      <UserPlus className="w-4 h-4 mr-1" />
                      Добавить
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Hint */}
          <p className="text-xs text-gray-400 text-center">
            Введите username (без @) или имя пользователя
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
