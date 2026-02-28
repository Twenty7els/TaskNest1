'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/demo-store';
import { WishlistCard } from './wishlist-card';
import { WishlistForm } from './wishlist-form';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Gift, Plus, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function WishlistList() {
  const [showForm, setShowForm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  const currentUser = useAppStore((state) => state.currentUser);
  const getMyWishlist = useAppStore((state) => state.getMyWishlist);
  const getFriends = useAppStore((state) => state.getFriends);
  const getFriendWishlist = useAppStore((state) => state.getFriendWishlist);

  const myWishlist = getMyWishlist();
  const friends = getFriends(currentUser.id);

  const getSelectedWishlist = () => {
    if (!selectedUserId) return [];
    return getFriendWishlist(selectedUserId);
  };

  const getSelectedUser = () => {
    if (!selectedUserId) return null;
    return friends.find((f) => f.id === selectedUserId);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-amber-500" />
            <span className="font-medium text-gray-900">Вишлист</span>
          </div>
        </div>
      </div>

      {/* Tabs for My/Friends Wishlist */}
      <div className="px-4 py-2">
        <Tabs value={selectedUserId || 'my'} onValueChange={(v) => setSelectedUserId(v === 'my' ? null : v)}>
          <TabsList className="w-full flex overflow-x-auto gap-1 h-auto p-1 bg-gray-100 rounded-xl">
            <TabsTrigger 
              value="my" 
              className="flex-shrink-0 rounded-lg data-[state=active]:bg-white"
            >
              <Heart className="w-4 h-4 mr-1" />
              Мой
            </TabsTrigger>
            {friends.map((friend) => (
              <TabsTrigger
                key={friend.id}
                value={friend.id}
                className="flex-shrink-0 rounded-lg data-[state=active]:bg-white"
              >
                <Avatar className="w-4 h-4 mr-1">
                  <AvatarImage src={friend.avatar_url} />
                  <AvatarFallback className="text-[8px]">
                    {friend.first_name[0]}
                  </AvatarFallback>
                </Avatar>
                {friend.first_name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Wishlist Items */}
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        <AnimatePresence mode="popLayout">
          {selectedUserId === null ? (
            // My Wishlist
            myWishlist.length > 0 ? (
              <div className="space-y-4 py-2">
                {myWishlist.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <WishlistCard item={item} isOwn={true} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-64 text-gray-400"
              >
                <Gift className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg font-medium">Ваш вишлист пуст</p>
                <p className="text-sm">Добавьте желаемые подарки</p>
              </motion.div>
            )
          ) : (
            // Friend's Wishlist
            getSelectedWishlist().length > 0 ? (
              <div className="space-y-4 py-2">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={getSelectedUser()?.avatar_url} />
                    <AvatarFallback>{getSelectedUser()?.first_name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-600">
                    Вишлист {getSelectedUser()?.first_name}
                  </span>
                </div>
                {getSelectedWishlist().map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <WishlistCard item={item} isOwn={false} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-64 text-gray-400"
              >
                <Gift className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg font-medium">Вишлист пуст</p>
                <p className="text-sm">У друга пока нет желаний</p>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>

      {/* Floating Action Button (only for own wishlist) */}
      {selectedUserId === null && (
        <div className="fixed bottom-20 right-4 z-40">
          <Button
            onClick={() => setShowForm(true)}
            size="icon"
            className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg"
          >
            <Plus className="w-6 h-6 text-white" />
          </Button>
        </div>
      )}

      {/* Wishlist Form Modal */}
      <WishlistForm open={showForm} onClose={() => setShowForm(false)} />
    </div>
  );
}
