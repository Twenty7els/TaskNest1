'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Gift, CalendarDays, User as UserIcon, Users, Heart, Pencil } from 'lucide-react';

// Hooks
import {
  useCurrentUser,
  useFamilies,
  useTasks,
  useCategories,
  useEvents,
  useWishlist,
  useFriends,
  useUserProfile,
} from '@/hooks/use-family-app';

// Store (for UI state only)
import { useAppStore } from '@/lib/demo-store';

// Components
import { BottomNav } from '@/components/layout/bottom-nav';
import { Header } from '@/components/layout/header';
import { TaskCard } from '@/components/tasks/task-card';
import { TaskForm } from '@/components/tasks/task-form';
import { TaskProgress } from '@/components/tasks/task-progress';
import { TaskArchive } from '@/components/tasks/task-archive';
import { EventCard } from '@/components/events/event-card';
import { EventForm } from '@/components/events/event-form';
import { WishlistCard } from '@/components/wishlist/wishlist-card';
import { WishlistForm } from '@/components/wishlist/wishlist-form';
import { FriendList } from '@/components/profile/friend-list';
import { FriendSearch } from '@/components/profile/friend-search';
import { FamilyManager } from '@/components/profile/family-manager';
import { FriendProfile } from '@/components/profile/friend-profile';
import { ProfileEditor } from '@/components/profile/profile-editor';
import { WishlistTransition } from '@/components/ui/wishlist-transition';

// UI Components
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Types
import { EventResponse, TabId, Task } from '@/types';

// Utils
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

// Declare Telegram WebApp type
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          text: string;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
        };
        BackButton: {
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
        };
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
        };
        colorScheme: 'light' | 'dark';
        initDataUnsafe?: {
          user?: {
            id: number;
            username?: string;
            first_name: string;
            last_name?: string;
            photo_url?: string;
          };
        };
      };
    };
  }
}

export default function FamilyApp() {
  // Initialize Telegram WebApp
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
    }
  }, []);

  // UI State from store
  const {
    activeTab,
    selectedFriendId,
    isTaskFormOpen,
    isEventFormOpen,
    isWishlistFormOpen,
    isArchiveOpen,
    isFriendSearchOpen,
    isFamilyManagerOpen,
    isProfileEditorOpen,
    setActiveTab,
    setSelectedFriendId,
    openTaskForm,
    closeTaskForm,
    openEventForm,
    closeEventForm,
    openWishlistForm,
    closeWishlistForm,
    openArchive,
    closeArchive,
    openFriendSearch,
    closeFriendSearch,
    openFamilyManager,
    closeFamilyManager,
    openProfileEditor,
    closeProfileEditor,
  } = useAppStore();

  // Data hooks
  const { currentUser, updateCurrentUser } = useCurrentUser();
  const {
    families,
    selectedFamilyId,
    selectedFamily,
    familyMembers,
    setSelectedFamilyId,
    createFamily,
    inviteToFamily,
    leaveFamily,
    removeMember,
  } = useFamilies(currentUser?.id);

  const { categories } = useCategories();
  const { activeTasks, archivedTasks, addTask, completeTask, archiveTask, deleteTask } =
    useTasks(selectedFamilyId);
  const { events, addEvent, respondToEvent, deleteEvent } = useEvents(currentUser?.id);
  const { myWishlist, addItem: addWishlistItem, bookItem, cancelBooking, deleteItem: deleteWishlistItem } =
    useWishlist(currentUser?.id);
  const {
    friends,
    friendIds,
    requests: pendingRequests,
    users,
    pendingRequestUserIds,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
  } = useFriends(currentUser?.id);

  // Local state
  const [wishlistMode, setWishlistMode] = useState<'mine' | 'friends'>('mine');
  const [selectedFriendFilter, setSelectedFriendFilter] = useState<string | null>(null);
  const [showWishlistTransition, setShowWishlistTransition] = useState(false);
  const [friendProfileSource, setFriendProfileSource] = useState<TabId | null>(null);

  // Friend profile data
  const { user: selectedFriend, wishlist: friendWishlist, isFriend } = useUserProfile(selectedFriendId);

  const isFriendInFamily = useMemo(() => {
    if (!selectedFriendId || !selectedFamily) return false;
    return selectedFamily.members?.some((m) => m.user_id === selectedFriendId) || false;
  }, [selectedFriendId, selectedFamily]);

  // Friends with wishlist data
  const friendsWithWishlist = useMemo(() => {
    return friends.map((friend) => ({
      ...friend,
      wishlist: friend.wishlist || [],
    }));
  }, [friends]);

  // Handlers
  const handleCompleteTask = (taskId: string) => {
    completeTask(taskId);
  };

  const handleArchiveTask = (taskId: string) => {
    archiveTask(taskId);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
  };

  const handleEventResponse = (eventId: string, response: EventResponse) => {
    respondToEvent({ eventId, response });
  };

  const handleDeleteEvent = (eventId: string) => {
    deleteEvent(eventId);
  };

  const handleBookWishlistItem = (itemId: string) => {
    bookItem({ itemId, bookedBy: currentUser.id });
  };

  const handleCancelBooking = (itemId: string) => {
    cancelBooking(itemId);
  };

  const handleViewFriendProfile = (userId: string, source?: TabId) => {
    setSelectedFriendId(userId);
    setFriendProfileSource(source || activeTab);
  };

  const handleBackFromProfile = () => {
    setSelectedFriendId(null);
    setFriendProfileSource(null);
  };

  const handleAddFriend = () => {
    if (selectedFriendId) {
      sendFriendRequest(selectedFriendId);
    }
  };

  const handleInviteToFamily = (familyId: string) => {
    if (selectedFriendId) {
      inviteToFamily({ familyId, invitedUserId: selectedFriendId });
    }
  };

  // Handle tab change with wishlist animation
  const handleTabChange = (tab: TabId) => {
    // Close friend profile if open
    if (selectedFriendId) {
      setSelectedFriendId(null);
      setFriendProfileSource(null);
    }

    if (tab === 'wishlist' && activeTab !== 'wishlist') {
      // Show transition animation
      setShowWishlistTransition(true);
      // Hide animation and switch tab after delay
      setTimeout(() => {
        setShowWishlistTransition(false);
        setActiveTab(tab);
      }, 1500);
    } else {
      setActiveTab(tab);
    }
  };

  // Swipe between tabs
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const tabsOrder: TabId[] = ['tasks', 'events', 'wishlist', 'profile'];

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(diff) > minSwipeDistance) {
      const currentIndex = tabsOrder.indexOf(activeTab);

      if (diff > 0 && currentIndex < tabsOrder.length - 1) {
        // Swipe left - go to next tab
        handleTabChange(tabsOrder[currentIndex + 1]);
      } else if (diff < 0 && currentIndex > 0) {
        // Swipe right - go to previous tab
        handleTabChange(tabsOrder[currentIndex - 1]);
      }
    }
  };

  // Format birthday
  const formattedBirthday = currentUser.birthday
    ? format(new Date(currentUser.birthday), 'd MMMM', { locale: ru })
    : null;

  const isWishlistTab = activeTab === 'wishlist';
  const isDarkMode = isWishlistTab || friendProfileSource === 'wishlist';

  return (
    <div
      className={`min-h-screen pb-28 transition-colors duration-300 ${isDarkMode ? 'bg-black' : 'bg-white'}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Wishlist Transition Animation */}
      <WishlistTransition isVisible={showWishlistTransition} />

      {/* Header */}
      {!selectedFriend && (
        <Header
          title={
            activeTab === 'tasks'
              ? 'Задачи'
              : activeTab === 'events'
              ? 'Мероприятия'
              : activeTab === 'wishlist'
              ? 'Wishlist'
              : 'Профиль'
          }
          families={families}
          selectedFamilyId={selectedFamilyId}
          onSelectFamily={setSelectedFamilyId}
          onOpenArchive={openArchive}
          onOpenFamilyManager={openFamilyManager}
          showArchive={activeTab === 'tasks'}
          showFamilySelector={activeTab === 'tasks' || activeTab === 'profile'}
          isDark={isWishlistTab}
        />
      )}

      {/* Content */}
      <main className="max-w-md mx-auto px-4 py-4">
        {/* Friend Profile View */}
        {selectedFriend && (
          <FriendProfile
            friend={selectedFriend}
            wishlist={friendWishlist}
            isFriend={isFriend}
            isInFamily={isFriendInFamily}
            currentUserId={currentUser.id}
            families={families.map((f) => ({ id: f.id, name: f.name }))}
            onBack={handleBackFromProfile}
            onAddFriend={handleAddFriend}
            onInviteToFamily={handleInviteToFamily}
            onBookWishlistItem={handleBookWishlistItem}
            onCancelBooking={handleCancelBooking}
            isDark={friendProfileSource === 'wishlist'}
          />
        )}

        {/* Tasks Tab */}
        {!selectedFriend && activeTab === 'tasks' && (
          <div className="space-y-4">
            {/* Progress */}
            <TaskProgress tasks={activeTasks} />

            {/* No Family Message */}
            {!selectedFamilyId && (
              <div className="text-center py-16 text-gray-400">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarDays className="w-10 h-10 opacity-50" />
                </div>
                <p className="text-lg font-medium text-gray-600">Выберите семью</p>
                <p className="text-sm mt-1">или создайте новую в профиле</p>
              </div>
            )}

            {/* Task Cards */}
            {selectedFamilyId && activeTasks.length > 0 && (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {activeTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onComplete={() => handleCompleteTask(task.id)}
                      onArchive={() => handleArchiveTask(task.id)}
                      onDelete={() => handleDeleteTask(task.id)}
                      users={familyMembers as any}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Empty State */}
            {selectedFamilyId && activeTasks.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Plus className="w-8 h-8 opacity-50" />
                </div>
                <p className="text-lg font-medium">Нет задач</p>
                <p className="text-sm">Добавьте первую задачу</p>
              </div>
            )}
          </div>
        )}

        {/* Events Tab */}
        {!selectedFriend && activeTab === 'events' && (
          <div className="space-y-4">
            {events.length > 0 ? (
              <div className="grid gap-4">
                <AnimatePresence mode="popLayout">
                  {events.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      currentUserId={currentUser.id}
                      onResponse={handleEventResponse}
                      onDelete={handleDeleteEvent}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <CalendarDays className="w-16 h-16 mx-auto mb-3 opacity-50" />
                <p className="text-lg font-medium">Нет мероприятий</p>
                <p className="text-sm">Создайте мероприятие и пригласите друзей</p>
              </div>
            )}
          </div>
        )}

        {/* Wishlist Tab */}
        {!selectedFriend && activeTab === 'wishlist' && (
          <div className="space-y-4">
            {/* Mode Toggle */}
            <div className="flex gap-2 p-1 border border-white/40 rounded-2xl">
              <button
                onClick={() => {
                  setWishlistMode('mine');
                  setSelectedFriendFilter(null);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium transition-all ${
                  wishlistMode === 'mine' ? 'bg-white text-gray-900' : 'text-white'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Мой</span>
              </button>
              <button
                onClick={() => setWishlistMode('friends')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium transition-all ${
                  wishlistMode === 'friends' ? 'bg-white text-gray-900' : 'text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Друзья</span>
              </button>
            </div>

            {/* Friend Filter - only in friends mode */}
            {wishlistMode === 'friends' && friendsWithWishlist.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {/* All Friends Button */}
                <button
                  onClick={() => setSelectedFriendFilter(null)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedFriendFilter === null
                      ? 'bg-white text-gray-900'
                      : 'border border-white text-white'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Все</span>
                </button>
                {/* Individual Friends */}
                {friendsWithWishlist.map((friend) => (
                  <button
                    key={friend.id}
                    onClick={() => setSelectedFriendFilter(friend.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedFriendFilter === friend.id
                        ? 'bg-white text-gray-900'
                        : 'border border-white text-white'
                    }`}
                  >
                    <Avatar className="w-5 h-5">
                      <AvatarImage src={friend.avatar_url || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-pink-400 to-rose-500 text-white text-xs">
                        {friend.first_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span>{friend.first_name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* My Wishlist */}
            {wishlistMode === 'mine' && (
              <>
                {myWishlist.length > 0 ? (
                  <div className="grid gap-4">
                    <AnimatePresence mode="popLayout">
                      {myWishlist.map((item) => (
                        <WishlistCard
                          key={item.id}
                          item={item}
                          isOwner={true}
                          currentUserId={currentUser.id}
                          onBook={() => {}}
                          onCancelBooking={() => {}}
                          onDelete={(id) => deleteWishlistItem(id)}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Gift className="w-16 h-16 mx-auto mb-3 opacity-50" />
                    <p className="text-lg font-medium text-gray-300">Вишлист пуст</p>
                    <p className="text-sm">Добавьте желанные подарки</p>
                  </div>
                )}
              </>
            )}

            {/* Friends Wishlist */}
            {wishlistMode === 'friends' && (
              <>
                {friendsWithWishlist.length > 0 ? (
                  <div className="space-y-4">
                    {(selectedFriendFilter
                      ? friendsWithWishlist.filter((f) => f.id === selectedFriendFilter)
                      : friendsWithWishlist
                    ).map((friend) => {
                      // Get wishlist from useWishlist hook for each friend
                      const friendWishlistItems = []; // This would need another hook call

                      return (
                        <div key={friend.id} className="space-y-3">
                          {/* Friend Header */}
                          <button
                            onClick={() => handleViewFriendProfile(friend.id, 'wishlist')}
                            className="flex items-center gap-3 w-full text-left"
                          >
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={friend.avatar_url || ''} />
                              <AvatarFallback className="bg-gradient-to-br from-pink-400 to-rose-500 text-white">
                                {friend.first_name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-medium text-white">
                                {friend.first_name} {friend.last_name}
                              </p>
                              <p className="text-sm text-gray-400">
                                {(friend as any).wishlist?.length || 0} подарков
                              </p>
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="w-16 h-16 mx-auto mb-3 opacity-50" />
                    <p className="text-lg font-medium text-gray-300">Нет друзей</p>
                    <p className="text-sm">Добавьте друзей в профиле</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {!selectedFriend && activeTab === 'profile' && (
          <div className="space-y-6">
            {/* User Card */}
            <div className="bg-gray-100 rounded-2xl p-5 relative">
              <button
                onClick={openProfileEditor}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                title="Редактировать профиль"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={currentUser.avatar_url || ''} />
                  <AvatarFallback className="text-xl bg-gradient-to-br from-pink-400 to-rose-500 text-white">
                    {currentUser.first_name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {currentUser.first_name} {currentUser.last_name}
                  </h2>
                  <p className="text-gray-500">@{currentUser.username}</p>
                  {currentUser.birthday && currentUser.show_birthday && (
                    <p className="text-sm text-gray-500 mt-1">🎂 {formattedBirthday}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-100 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-blue-500">{friends.length}</p>
                <p className="text-sm text-gray-500">Друзей</p>
              </div>
              <div className="bg-gray-100 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-green-500">{families.length}</p>
                <p className="text-sm text-gray-500">Семей</p>
              </div>
              <div className="bg-gray-100 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-pink-500">{myWishlist.length}</p>
                <p className="text-sm text-gray-500">Подарков</p>
              </div>
            </div>

            {/* Friends Section */}
            <div className="bg-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Друзья</h3>
                <Button size="sm" onClick={openFriendSearch}>
                  <Plus className="w-4 h-4 mr-1" />
                  Найти
                </Button>
              </div>
              <FriendList
                friends={friends}
                pendingRequests={pendingRequests}
                onAcceptRequest={acceptFriendRequest}
                onDeclineRequest={declineFriendRequest}
                onViewProfile={handleViewFriendProfile}
                onRemoveFriend={removeFriend}
              />
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      {!selectedFriend && activeTab !== 'profile' && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (activeTab === 'tasks') openTaskForm();
            if (activeTab === 'events') openEventForm();
            if (activeTab === 'wishlist') openWishlistForm();
          }}
          className={`fixed bottom-28 right-4 w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center z-40 transition-colors duration-300 ${
            isWishlistTab
              ? 'bg-white text-black shadow-white/20'
              : 'bg-black text-white border border-gray-800'
          }`}
        >
          {isWishlistTab ? (
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
              <path d="M12 2l3 9h7l-5.5 4 2 7-6.5-4.5-6.5 4.5 2-7L2 11h7z" />
            </svg>
          ) : (
            <Plus className="w-6 h-6" />
          )}
        </motion.button>
      )}

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} isDark={isDarkMode} />

      {/* Modals */}
      {/* Task Form */}
      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={closeTaskForm}
        onSubmit={addTask}
        categories={categories}
        familyMembers={familyMembers as any}
        currentUser={currentUser}
        selectedFamilyId={selectedFamilyId || ''}
      />

      {/* Event Form */}
      <EventForm
        isOpen={isEventFormOpen}
        onClose={closeEventForm}
        onSubmit={addEvent}
        friends={friends}
        currentUser={currentUser}
      />

      {/* Wishlist Form */}
      <WishlistForm
        isOpen={isWishlistFormOpen}
        onClose={closeWishlistForm}
        onSubmit={addWishlistItem}
        currentUserId={currentUser.id}
      />

      {/* Task Archive */}
      <TaskArchive isOpen={isArchiveOpen} onClose={closeArchive} tasks={archivedTasks} />

      {/* Friend Search */}
      <FriendSearch
        isOpen={isFriendSearchOpen}
        onClose={closeFriendSearch}
        users={users}
        currentUserId={currentUser.id}
        friendIds={friendIds}
        pendingRequestUserIds={pendingRequestUserIds}
        onSendRequest={sendFriendRequest}
      />

      {/* Family Manager */}
      <FamilyManager
        isOpen={isFamilyManagerOpen}
        onClose={closeFamilyManager}
        families={families}
        currentUserId={currentUser.id}
        friends={friends}
        selectedFamilyId={selectedFamilyId}
        onCreateFamily={createFamily}
        onInviteToFamily={inviteToFamily}
        onLeaveFamily={leaveFamily}
        onRemoveMember={removeMember}
        onSelectFamily={setSelectedFamilyId}
      />

      {/* Profile Editor */}
      <ProfileEditor
        isOpen={isProfileEditorOpen}
        onClose={closeProfileEditor}
        user={currentUser}
        onUpdate={updateCurrentUser}
      />
    </div>
  );
}
