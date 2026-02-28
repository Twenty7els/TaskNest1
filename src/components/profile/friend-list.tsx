'use client';

import { motion } from 'framer-motion';
import { UserPlus, Check, X, User } from 'lucide-react';
import { User as UserType, FriendRequest } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface FriendListProps {
  friends: UserType[];
  pendingRequests: FriendRequest[];
  onAcceptRequest: (requestId: string) => void;
  onDeclineRequest: (requestId: string) => void;
  onViewProfile: (userId: string) => void;
  onRemoveFriend?: (friendId: string) => void;
}

export function FriendList({
  friends,
  pendingRequests,
  onAcceptRequest,
  onDeclineRequest,
  onViewProfile,
  onRemoveFriend,
}: FriendListProps) {
  return (
    <div className="space-y-4">
      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Запросы в друзья
          </h3>
          <div className="space-y-2">
            {pendingRequests.map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-yellow-50 rounded-xl p-3 border border-yellow-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={request.sender?.avatar_url || ''} />
                      <AvatarFallback>
                        {request.sender?.first_name?.[0] || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">
                        {request.sender?.first_name} {request.sender?.last_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        @{request.sender?.username}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-green-500 hover:bg-green-600"
                      onClick={() => onAcceptRequest(request.id)}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => onDeclineRequest(request.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Friends List */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Друзья ({friends.length})
        </h3>
        {friends.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <UserPlus className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>У вас пока нет друзей</p>
            <p className="text-sm">Найдите друзей по username</p>
          </div>
        ) : (
          <div className="grid gap-2">
            {friends.map((friend) => (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-3 border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onViewProfile(friend.id)}
                    className="flex items-center gap-3 flex-1 min-w-0 text-left"
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={friend.avatar_url || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                        {friend.first_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {friend.first_name} {friend.last_name}
                      </p>
                      <p className="text-sm text-gray-500">@{friend.username}</p>
                    </div>
                  </button>
                  
                  {/* Delete button */}
                  {onRemoveFriend && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFriend(friend.id);
                      }}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      title="Удалить из друзей"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
