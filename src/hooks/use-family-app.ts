// =====================================================
// Family App - React Query Hooks
// =====================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { config } from '@/lib/config';
import { useAppStore } from '@/lib/demo-store';
import {
  Task,
  Event,
  WishlistItem,
  User,
  FamilyGroup,
  FriendRequest,
  EventResponse,
  TaskStatus,
} from '@/types';

// =====================================================
// API FUNCTIONS
// =====================================================

const API_BASE = '/api';

async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<{ data: T | null; error: string | null }> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return { data: null, error: result.error || 'Unknown error' };
    }

    return { data: result.data, error: null };
  } catch (err) {
    return { data: null, error: String(err) };
  }
}

// =====================================================
// CURRENT USER HOOK
// =====================================================

export function useCurrentUser() {
  const storeCurrentUser = useAppStore((state) => state.currentUser);
  const updateCurrentUser = useAppStore((state) => state.updateCurrentUser);

  const { data: currentUser, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      if (config.useDemoData) {
        return storeCurrentUser;
      }

      // Get Telegram user data from URL or storage
      const tgUser = typeof window !== 'undefined'
        ? (window as any).Telegram?.WebApp?.initDataUnsafe?.user
        : null;

      if (!tgUser) {
        return storeCurrentUser; // Fallback to demo
      }

      const { data, error } = await apiFetch<User>('/users', {
        method: 'POST',
        body: JSON.stringify({
          telegram_id: tgUser.id,
          username: tgUser.username,
          first_name: tgUser.first_name,
          last_name: tgUser.last_name,
          avatar_url: tgUser.photo_url,
        }),
      });

      return data || storeCurrentUser;
    },
    initialData: storeCurrentUser,
  });

  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<User>) => {
      if (config.useDemoData) {
        updateCurrentUser(updates);
        return { ...storeCurrentUser, ...updates };
      }

      const { data, error } = await apiFetch<User>('/users', {
        method: 'PATCH',
        body: JSON.stringify({ id: currentUser?.id, ...updates }),
      });

      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (!config.useDemoData) {
        updateCurrentUser(data || {});
      }
    },
  });

  return {
    currentUser: currentUser || storeCurrentUser,
    isLoading,
    updateCurrentUser: updateMutation.mutate,
  };
}

// =====================================================
// FAMILIES HOOK
// =====================================================

export function useFamilies(userId: string | undefined) {
  const storeFamilies = useAppStore((state) => state.families);
  const createFamilyStore = useAppStore((state) => state.createFamily);
  const inviteToFamilyStore = useAppStore((state) => state.inviteToFamily);
  const leaveFamilyStore = useAppStore((state) => state.leaveFamily);
  const removeMemberStore = useAppStore((state) => state.removeMember);
  const selectedFamilyId = useAppStore((state) => state.selectedFamilyId);
  const setSelectedFamilyId = useAppStore((state) => state.setSelectedFamilyId);

  const queryClient = useQueryClient();

  const { data: families = [], isLoading } = useQuery({
    queryKey: ['families', userId],
    queryFn: async () => {
      if (config.useDemoData || !userId) {
        return storeFamilies;
      }

      const { data, error } = await apiFetch<FamilyGroup[]>(`/families?user_id=${userId}`);
      if (error) console.error('Error fetching families:', error);
      return data || [];
    },
    initialData: config.useDemoData ? storeFamilies : undefined,
  });

  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      if (config.useDemoData) {
        createFamilyStore(name);
        return null;
      }

      const { data, error } = await apiFetch<FamilyGroup>('/families', {
        method: 'POST',
        body: JSON.stringify({ name, created_by: userId }),
      });

      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['families', userId] });
    },
  });

  const inviteMutation = useMutation({
    mutationFn: async ({ familyId, invitedUserId }: { familyId: string; invitedUserId: string }) => {
      if (config.useDemoData) {
        inviteToFamilyStore(familyId, invitedUserId);
        return true;
      }

      const { error } = await apiFetch('/families', {
        method: 'PATCH',
        body: JSON.stringify({ action: 'invite', family_id: familyId, user_id: invitedUserId }),
      });

      if (error) throw new Error(error);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['families', userId] });
    },
  });

  const leaveMutation = useMutation({
    mutationFn: async ({ familyId }: { familyId: string }) => {
      if (config.useDemoData) {
        leaveFamilyStore(familyId);
        return true;
      }

      const { error } = await apiFetch('/families', {
        method: 'PATCH',
        body: JSON.stringify({ action: 'leave', family_id: familyId, user_id: userId }),
      });

      if (error) throw new Error(error);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['families', userId] });
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: async ({ familyId, memberId }: { familyId: string; memberId: string }) => {
      if (config.useDemoData) {
        removeMemberStore(familyId, memberId);
        return true;
      }

      const { error } = await apiFetch('/families', {
        method: 'PATCH',
        body: JSON.stringify({ action: 'remove', family_id: familyId, user_id: memberId }),
      });

      if (error) throw new Error(error);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['families', userId] });
    },
  });

  const selectedFamily = families.find((f) => f.id === selectedFamilyId);
  const familyMembers = selectedFamily?.members?.map((m) => m.user).filter(Boolean) || [];

  return {
    families,
    selectedFamilyId,
    selectedFamily,
    familyMembers,
    setSelectedFamilyId,
    isLoading,
    createFamily: createMutation.mutate,
    inviteToFamily: inviteMutation.mutate,
    leaveFamily: leaveMutation.mutate,
    removeMember: removeMemberMutation.mutate,
  };
}

// =====================================================
// TASKS HOOK
// =====================================================

export function useTasks(familyId: string | null | undefined) {
  const storeTasks = useAppStore((state) => state.tasks);
  const addTaskStore = useAppStore((state) => state.addTask);
  const completeTaskStore = useAppStore((state) => state.completeTask);
  const archiveTaskStore = useAppStore((state) => state.archiveTask);
  const deleteTaskStore = useAppStore((state) => state.deleteTask);

  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks', familyId],
    queryFn: async () => {
      if (config.useDemoData || !familyId) {
        return storeTasks;
      }

      const { data, error } = await apiFetch<Task[]>(`/tasks?family_id=${familyId}`);
      if (error) console.error('Error fetching tasks:', error);
      return data || [];
    },
    initialData: config.useDemoData ? storeTasks : undefined,
    enabled: !!familyId || config.useDemoData,
  });

  const activeTasks = tasks.filter(
    (t) => t.family_id === familyId && (t.status === 'active' || t.status === 'completed')
  );

  const archivedTasks = tasks.filter(
    (t) => t.family_id === familyId && t.status === 'archived'
  );

  const addMutation = useMutation({
    mutationFn: async (task: Omit<Task, 'id' | 'created_at'>) => {
      if (config.useDemoData) {
        addTaskStore(task);
        return null;
      }

      const { data, error } = await apiFetch<Task>('/tasks', {
        method: 'POST',
        body: JSON.stringify(task),
      });

      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', familyId] });
    },
  });

  const completeMutation = useMutation({
    mutationFn: async (taskId: string) => {
      if (config.useDemoData) {
        completeTaskStore(taskId);
        return true;
      }

      const { error } = await apiFetch('/tasks', {
        method: 'PATCH',
        body: JSON.stringify({
          id: taskId,
          status: 'completed',
          completed_at: new Date().toISOString(),
        }),
      });

      if (error) throw new Error(error);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', familyId] });
    },
  });

  const archiveMutation = useMutation({
    mutationFn: async (taskId: string) => {
      if (config.useDemoData) {
        archiveTaskStore(taskId);
        return true;
      }

      const { error } = await apiFetch('/tasks', {
        method: 'PATCH',
        body: JSON.stringify({ id: taskId, status: 'archived' }),
      });

      if (error) throw new Error(error);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', familyId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (taskId: string) => {
      if (config.useDemoData) {
        deleteTaskStore(taskId);
        return true;
      }

      const { error } = await apiFetch(`/tasks?id=${taskId}`, { method: 'DELETE' });
      if (error) throw new Error(error);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', familyId] });
    },
  });

  return {
    tasks,
    activeTasks,
    archivedTasks,
    isLoading,
    addTask: addMutation.mutate,
    completeTask: completeMutation.mutate,
    archiveTask: archiveMutation.mutate,
    deleteTask: deleteMutation.mutate,
  };
}

// =====================================================
// CATEGORIES HOOK
// =====================================================

export function useCategories() {
  const storeCategories = useAppStore((state) => state.categories);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      if (config.useDemoData) {
        return storeCategories;
      }

      const { data, error } = await apiFetch<TaskCategory[]>('/tasks?categories=true');
      if (error) console.error('Error fetching categories:', error);
      return data || [];
    },
    initialData: storeCategories,
  });

  return { categories };
}

// TaskCategory type
import { TaskCategory } from '@/types';

// =====================================================
// EVENTS HOOK
// =====================================================

export function useEvents(userId: string | undefined) {
  const storeEvents = useAppStore((state) => state.events);
  const addEventStore = useAppStore((state) => state.addEvent);
  const updateEventResponseStore = useAppStore((state) => state.updateEventResponse);
  const deleteEventStore = useAppStore((state) => state.deleteEvent);

  const queryClient = useQueryClient();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events', userId],
    queryFn: async () => {
      if (config.useDemoData || !userId) {
        return storeEvents;
      }

      const { data, error } = await apiFetch<Event[]>(`/events?user_id=${userId}`);
      if (error) console.error('Error fetching events:', error);
      return data || [];
    },
    initialData: config.useDemoData ? storeEvents : undefined,
  });

  const myEvents = events.filter(
    (e) =>
      e.created_by === userId ||
      e.invited_users?.includes(userId || '') ||
      e.participants?.some((p) => p.user_id === userId)
  );

  const addMutation = useMutation({
    mutationFn: async (event: Omit<Event, 'id' | 'created_at'>) => {
      if (config.useDemoData) {
        addEventStore(event);
        return null;
      }

      const { data, error } = await apiFetch<Event>('/events', {
        method: 'POST',
        body: JSON.stringify(event),
      });

      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', userId] });
    },
  });

  const respondMutation = useMutation({
    mutationFn: async ({ eventId, response }: { eventId: string; response: EventResponse }) => {
      if (config.useDemoData) {
        updateEventResponseStore(eventId, userId!, response);
        return true;
      }

      const { error } = await apiFetch('/events', {
        method: 'PATCH',
        body: JSON.stringify({
          type: 'response',
          event_id: eventId,
          user_id: userId,
          response,
        }),
      });

      if (error) throw new Error(error);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', userId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (eventId: string) => {
      if (config.useDemoData) {
        deleteEventStore(eventId);
        return true;
      }

      const { error } = await apiFetch(`/events?id=${eventId}`, { method: 'DELETE' });
      if (error) throw new Error(error);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', userId] });
    },
  });

  return {
    events: myEvents,
    isLoading,
    addEvent: addMutation.mutate,
    respondToEvent: respondMutation.mutate,
    deleteEvent: deleteMutation.mutate,
  };
}

// =====================================================
// WISHLIST HOOK
// =====================================================

export function useWishlist(userId: string | undefined) {
  const storeItems = useAppStore((state) => state.wishlistItems);
  const addItemStore = useAppStore((state) => state.addWishlistItem);
  const bookItemStore = useAppStore((state) => state.bookWishlistItem);
  const cancelBookingStore = useAppStore((state) => state.cancelBooking);
  const deleteItemStore = useAppStore((state) => state.deleteWishlistItem);

  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['wishlist', userId],
    queryFn: async () => {
      if (config.useDemoData || !userId) {
        return storeItems;
      }

      const { data, error } = await apiFetch<WishlistItem[]>(`/wishlist?user_id=${userId}`);
      if (error) console.error('Error fetching wishlist:', error);
      return data || [];
    },
    initialData: config.useDemoData ? storeItems : undefined,
  });

  const myWishlist = items.filter((w) => w.user_id === userId);

  const addMutation = useMutation({
    mutationFn: async (item: Omit<WishlistItem, 'id' | 'created_at' | 'is_booked'>) => {
      if (config.useDemoData) {
        addItemStore(item);
        return null;
      }

      const { data, error } = await apiFetch<WishlistItem>('/wishlist', {
        method: 'POST',
        body: JSON.stringify(item),
      });

      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', userId] });
    },
  });

  const bookMutation = useMutation({
    mutationFn: async ({ itemId, bookedBy }: { itemId: string; bookedBy: string }) => {
      if (config.useDemoData) {
        bookItemStore(itemId, bookedBy);
        return true;
      }

      const { error } = await apiFetch('/wishlist', {
        method: 'PATCH',
        body: JSON.stringify({
          action: 'book',
          item_id: itemId,
          booked_by: bookedBy,
        }),
      });

      if (error) throw new Error(error);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (itemId: string) => {
      if (config.useDemoData) {
        cancelBookingStore(itemId);
        return true;
      }

      const { error } = await apiFetch('/wishlist', {
        method: 'PATCH',
        body: JSON.stringify({ action: 'cancel', item_id: itemId }),
      });

      if (error) throw new Error(error);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (itemId: string) => {
      if (config.useDemoData) {
        deleteItemStore(itemId);
        return true;
      }

      const { error } = await apiFetch(`/wishlist?id=${itemId}`, { method: 'DELETE' });
      if (error) throw new Error(error);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', userId] });
    },
  });

  return {
    items,
    myWishlist,
    isLoading,
    addItem: addMutation.mutate,
    bookItem: bookMutation.mutate,
    cancelBooking: cancelMutation.mutate,
    deleteItem: deleteMutation.mutate,
  };
}

// =====================================================
// FRIENDS HOOK
// =====================================================

export function useFriends(userId: string | undefined) {
  const storeUsers = useAppStore((state) => state.users);
  const storeFriendships = useAppStore((state) => state.friendships);
  const storeFriendRequests = useAppStore((state) => state.friendRequests);
  const sendRequestStore = useAppStore((state) => state.sendFriendRequest);
  const acceptRequestStore = useAppStore((state) => state.acceptFriendRequest);
  const declineRequestStore = useAppStore((state) => state.declineFriendRequest);
  const removeFriendStore = useAppStore((state) => state.removeFriend);

  const queryClient = useQueryClient();

  // Get friends
  const { data: friends = [], isLoading: friendsLoading } = useQuery({
    queryKey: ['friends', userId],
    queryFn: async () => {
      if (config.useDemoData || !userId) {
        const friendIds = storeFriendships
          .filter((f) => f.user_id === userId)
          .map((f) => f.friend_id);
        return storeUsers.filter((u) => friendIds.includes(u.id));
      }

      const { data, error } = await apiFetch<User[]>(`/friends?user_id=${userId}`);
      if (error) console.error('Error fetching friends:', error);
      return data || [];
    },
    initialData: config.useDemoData && userId
      ? storeUsers.filter((u) =>
          storeFriendships.some((f) => f.user_id === userId && f.friend_id === u.id)
        )
      : undefined,
  });

  // Get friend requests
  const { data: requests = [] } = useQuery({
    queryKey: ['friendRequests', userId],
    queryFn: async () => {
      if (config.useDemoData || !userId) {
        return storeFriendRequests.filter(
          (r) => r.receiver_id === userId && r.status === 'pending'
        );
      }

      const { data, error } = await apiFetch<FriendRequest[]>(
        `/friends?user_id=${userId}&type=requests`
      );
      if (error) console.error('Error fetching friend requests:', error);
      return data || [];
    },
    initialData: config.useDemoData && userId
      ? storeFriendRequests.filter((r) => r.receiver_id === userId && r.status === 'pending')
      : undefined,
  });

  // Get all users (for search)
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      if (config.useDemoData) {
        return storeUsers;
      }

      const { data, error } = await apiFetch<User[]>('/users');
      if (error) console.error('Error fetching users:', error);
      return data || [];
    },
    initialData: config.useDemoData ? storeUsers : undefined,
  });

  // Send friend request
  const sendRequestMutation = useMutation({
    mutationFn: async (receiverId: string) => {
      if (config.useDemoData) {
        sendRequestStore(receiverId);
        return true;
      }

      const { error } = await apiFetch('/friends', {
        method: 'POST',
        body: JSON.stringify({ sender_id: userId, receiver_id: receiverId }),
      });

      if (error) throw new Error(error);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends', userId] });
      queryClient.invalidateQueries({ queryKey: ['friendRequests', userId] });
    },
  });

  // Accept friend request
  const acceptRequestMutation = useMutation({
    mutationFn: async (requestId: string) => {
      if (config.useDemoData) {
        acceptRequestStore(requestId);
        return true;
      }

      const { error } = await apiFetch('/friends', {
        method: 'PATCH',
        body: JSON.stringify({ action: 'accept', request_id: requestId }),
      });

      if (error) throw new Error(error);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends', userId] });
      queryClient.invalidateQueries({ queryKey: ['friendRequests', userId] });
    },
  });

  // Decline friend request
  const declineRequestMutation = useMutation({
    mutationFn: async (requestId: string) => {
      if (config.useDemoData) {
        declineRequestStore(requestId);
        return true;
      }

      const { error } = await apiFetch('/friends', {
        method: 'PATCH',
        body: JSON.stringify({ action: 'decline', request_id: requestId }),
      });

      if (error) throw new Error(error);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests', userId] });
    },
  });

  // Remove friend
  const removeFriendMutation = useMutation({
    mutationFn: async (friendId: string) => {
      if (config.useDemoData) {
        removeFriendStore(friendId);
        return true;
      }

      const { error } = await apiFetch(`/friends?friend_id=${friendId}&user_id=${userId}`, {
        method: 'DELETE',
      });

      if (error) throw new Error(error);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends', userId] });
    },
  });

  const friendIds = friends.map((f) => f.id);
  const pendingRequestUserIds = config.useDemoData
    ? storeFriendRequests
        .filter((r) => r.sender_id === userId && r.status === 'pending')
        .map((r) => r.receiver_id)
    : [];

  return {
    friends,
    friendIds,
    requests,
    users,
    pendingRequestUserIds,
    isLoading: friendsLoading,
    sendFriendRequest: sendRequestMutation.mutate,
    acceptFriendRequest: acceptRequestMutation.mutate,
    declineFriendRequest: declineRequestMutation.mutate,
    removeFriend: removeFriendMutation.mutate,
  };
}

// =====================================================
// USER PROFILE HOOK
// =====================================================

export function useUserProfile(userId: string | null) {
  const storeUsers = useAppStore((state) => state.users);
  const storeItems = useAppStore((state) => state.wishlistItems);
  const storeFriendships = useAppStore((state) => state.friendships);
  const currentUser = useAppStore((state) => state.currentUser);

  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      if (!userId) return null;

      if (config.useDemoData) {
        return storeUsers.find((u) => u.id === userId) || null;
      }

      const { data, error } = await apiFetch<User>(`/users?id=${userId}`);
      if (error) console.error('Error fetching user:', error);
      return data;
    },
    enabled: !!userId,
  });

  const { data: wishlist = [] } = useQuery({
    queryKey: ['wishlist', userId],
    queryFn: async () => {
      if (!userId) return [];

      if (config.useDemoData) {
        return storeItems.filter((w) => w.user_id === userId);
      }

      const { data, error } = await apiFetch<WishlistItem[]>(`/wishlist?user_id=${userId}`);
      if (error) console.error('Error fetching wishlist:', error);
      return data || [];
    },
    enabled: !!userId,
  });

  const isFriend = config.useDemoData
    ? storeFriendships.some((f) => f.user_id === currentUser.id && f.friend_id === userId)
    : false;

  return {
    user,
    wishlist,
    isFriend,
  };
}
