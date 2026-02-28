'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Gift, Calendar, UserPlus, Users } from 'lucide-react';
import { User as UserType, WishlistItem } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WishlistCard } from '@/components/wishlist/wishlist-card';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface FriendProfileProps {
  friend: UserType;
  wishlist: WishlistItem[];
  isFriend: boolean;
  isInFamily: boolean;
  currentUserId: string;
  families: { id: string; name: string }[];
  onBack: () => void;
  onAddFriend: () => void;
  onInviteToFamily: (familyId: string) => void;
  onBookWishlistItem: (itemId: string) => void;
  onCancelBooking: (itemId: string) => void;
  isDark?: boolean;
}

export function FriendProfile({
  friend,
  wishlist,
  isFriend,
  isInFamily,
  currentUserId,
  families,
  onBack,
  onAddFriend,
  onInviteToFamily,
  onBookWishlistItem,
  onCancelBooking,
  isDark = false,
}: FriendProfileProps) {
  const formattedBirthday = friend.birthday
    ? format(new Date(friend.birthday), 'd MMMM', { locale: ru })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className={cn(
        "rounded-2xl p-5",
        isDark ? "bg-gray-900" : "bg-gray-100"
      )}>
        <button
          onClick={onBack}
          className={cn(
            "flex items-center gap-2 mb-4 transition-colors",
            isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700"
          )}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Назад</span>
        </button>

        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={friend.avatar_url || ''} />
            <AvatarFallback className="text-xl bg-gradient-to-br from-pink-400 to-rose-500 text-white">
              {friend.first_name[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className={cn("text-xl font-bold", isDark ? "text-white" : "text-gray-900")}>
              {friend.first_name} {friend.last_name}
            </h1>
            <p className={isDark ? "text-gray-400" : "text-gray-500"}>@{friend.username}</p>
            {formattedBirthday && friend.show_birthday && (
              <div className={cn("flex items-center gap-1 mt-1", isDark ? "text-gray-400" : "text-gray-500")}>
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{formattedBirthday}</span>
              </div>
            )}
          </div>
        </div>

        {/* Badges */}
        <div className="flex gap-2 mt-4">
          {isFriend && (
            <Badge className={isDark ? "bg-white/10 text-white border border-white/20" : "bg-gray-200 text-gray-700"}>
              Друг
            </Badge>
          )}
          {isInFamily && (
            <Badge className={isDark ? "bg-white/10 text-white border border-white/20" : "bg-gray-200 text-gray-700"}>
              В семье
            </Badge>
          )}
        </div>
      </div>

      {/* Actions */}
      {!isFriend && (
        <Button 
          className={cn("w-full", isDark && "bg-white text-black hover:bg-gray-100")}
          onClick={onAddFriend}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Добавить в друзья
        </Button>
      )}

      {isFriend && !isInFamily && families.length > 0 && (
        <div className="space-y-2">
          <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>Пригласить в семью:</p>
          <div className="flex flex-wrap gap-2">
            {families.map((family) => (
              <Button
                key={family.id}
                variant="outline"
                size="sm"
                onClick={() => onInviteToFamily(family.id)}
                className={isDark ? "border-white/30 text-white hover:bg-white/10" : ""}
              >
                <Users className="w-4 h-4 mr-1" />
                {family.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Wishlist */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Gift className={cn("w-5 h-5", isDark ? "text-gray-400" : "text-pink-500")} />
          <h2 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-gray-900")}>Wishlist</h2>
          <Badge variant="secondary" className={isDark ? "bg-gray-800 text-gray-300" : ""}>{wishlist.length}</Badge>
        </div>

        {wishlist.length === 0 ? (
          <div className={cn(
            "text-center py-8 rounded-xl",
            isDark ? "bg-gray-900 text-gray-500" : "bg-white text-gray-400 border border-gray-100"
          )}>
            <Gift className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Wishlist пуст</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {wishlist.map((item) => (
              <WishlistCard
                key={item.id}
                item={item}
                isOwner={false}
                currentUserId={currentUserId}
                onBook={onBookWishlistItem}
                onCancelBooking={onCancelBooking}
                onDelete={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
