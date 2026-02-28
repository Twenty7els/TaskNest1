// =====================================================
// Family App - Demo Store (Zustand)
// =====================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  User,
  FamilyGroup,
  Friendship,
  FriendRequest,
  Task,
  TaskCategory,
  Event,
  EventParticipant,
  WishlistItem,
  TaskStatus,
  EventResponse,
  TabId,
} from '@/types';
import {
  currentUser,
  demoUsers,
  demoFamilies,
  demoFriendships,
  demoFriendRequests,
  demoTasks,
  demoCategories,
  demoEvents,
  demoWishlistItems,
} from './demo-data';

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 15);

interface AppState {
  // Current user
  currentUser: User;
  
  // Data
  users: User[];
  families: FamilyGroup[];
  friendships: Friendship[];
  friendRequests: FriendRequest[];
  tasks: Task[];
  categories: TaskCategory[];
  events: Event[];
  wishlistItems: WishlistItem[];
  
  // UI State
  activeTab: TabId;
  selectedFamilyId: string | null;
  selectedFriendId: string | null;
  isTaskFormOpen: boolean;
  isEventFormOpen: boolean;
  isWishlistFormOpen: boolean;
  isArchiveOpen: boolean;
  isFriendSearchOpen: boolean;
  isFamilyManagerOpen: boolean;
  editingTaskId: string | null;
  editingEventId: string | null;
  editingWishlistId: string | null;
  isProfileEditorOpen: boolean;
  
  // Actions - Navigation
  setActiveTab: (tab: TabId) => void;
  setSelectedFamilyId: (id: string | null) => void;
  setSelectedFriendId: (id: string | null) => void;
  
  // Actions - Modals
  openTaskForm: (taskId?: string) => void;
  closeTaskForm: () => void;
  openEventForm: (eventId?: string) => void;
  closeEventForm: () => void;
  openWishlistForm: (itemId?: string) => void;
  closeWishlistForm: () => void;
  openArchive: () => void;
  closeArchive: () => void;
  openFriendSearch: () => void;
  closeFriendSearch: () => void;
  openFamilyManager: () => void;
  closeFamilyManager: () => void;
  openProfileEditor: () => void;
  closeProfileEditor: () => void;
  
  // Actions - User
  updateCurrentUser: (updates: Partial<User>) => void;
  
  // Actions - Tasks
  addTask: (task: Omit<Task, 'id' | 'created_at'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  completeTask: (id: string) => void;
  archiveTask: (id: string) => void;
  deleteTask: (id: string) => void;
  
  // Actions - Events
  addEvent: (event: Omit<Event, 'id' | 'created_at'>) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  updateEventResponse: (eventId: string, userId: string, response: EventResponse) => void;
  
  // Actions - Wishlist
  addWishlistItem: (item: Omit<WishlistItem, 'id' | 'created_at' | 'is_booked'>) => void;
  updateWishlistItem: (id: string, updates: Partial<WishlistItem>) => void;
  deleteWishlistItem: (id: string) => void;
  bookWishlistItem: (itemId: string, userId: string) => void;
  cancelBooking: (itemId: string) => void;
  
  // Actions - Friends
  sendFriendRequest: (receiverId: string) => void;
  acceptFriendRequest: (requestId: string) => void;
  declineFriendRequest: (requestId: string) => void;
  removeFriend: (friendId: string) => void;
  
  // Actions - Family
  createFamily: (name: string) => void;
  inviteToFamily: (familyId: string, userId: string) => void;
  leaveFamily: (familyId: string) => void;
  removeMember: (familyId: string, userId: string) => void;
  
  // Reset to demo data
  resetToDemo: () => void;
}

const initialState = {
  currentUser,
  users: demoUsers,
  families: demoFamilies,
  friendships: demoFriendships,
  friendRequests: demoFriendRequests,
  tasks: demoTasks,
  categories: demoCategories,
  events: demoEvents,
  wishlistItems: demoWishlistItems,
  activeTab: 'tasks' as TabId,
  selectedFamilyId: demoFamilies[0]?.id || null,
  selectedFriendId: null,
  isTaskFormOpen: false,
  isEventFormOpen: false,
  isWishlistFormOpen: false,
  isArchiveOpen: false,
  isFriendSearchOpen: false,
  isFamilyManagerOpen: false,
  editingTaskId: null,
  editingEventId: null,
  editingWishlistId: null,
  isProfileEditorOpen: false,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Navigation Actions
      setActiveTab: (tab) => set({ activeTab: tab }),
      setSelectedFamilyId: (id) => set({ selectedFamilyId: id }),
      setSelectedFriendId: (id) => set({ selectedFriendId: id }),
      
      // Modal Actions
      openTaskForm: (taskId) => set({ isTaskFormOpen: true, editingTaskId: taskId || null }),
      closeTaskForm: () => set({ isTaskFormOpen: false, editingTaskId: null }),
      openEventForm: (eventId) => set({ isEventFormOpen: true, editingEventId: eventId || null }),
      closeEventForm: () => set({ isEventFormOpen: false, editingEventId: null }),
      openWishlistForm: (itemId) => set({ isWishlistFormOpen: true, editingWishlistId: itemId || null }),
      closeWishlistForm: () => set({ isWishlistFormOpen: false, editingWishlistId: null }),
      openArchive: () => set({ isArchiveOpen: true }),
      closeArchive: () => set({ isArchiveOpen: false }),
      openFriendSearch: () => set({ isFriendSearchOpen: true }),
      closeFriendSearch: () => set({ isFriendSearchOpen: false }),
      openFamilyManager: () => set({ isFamilyManagerOpen: true }),
      closeFamilyManager: () => set({ isFamilyManagerOpen: false }),
      openProfileEditor: () => set({ isProfileEditorOpen: true }),
      closeProfileEditor: () => set({ isProfileEditorOpen: false }),
      
      // User Actions
      updateCurrentUser: (updates) => {
        set((state) => ({
          currentUser: { ...state.currentUser, ...updates },
        }));
      },
      
      // Task Actions
      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: generateId(),
          created_at: new Date().toISOString(),
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
      },
      
      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t
          ),
        }));
      },
      
      completeTask: (id) => {
        const { currentUser } = get();
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  status: 'completed' as TaskStatus,
                  completed_at: new Date().toISOString(),
                  completed_by: currentUser.id,
                }
              : t
          ),
        }));
      },
      
      archiveTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, status: 'archived' as TaskStatus } : t
          ),
        }));
      },
      
      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));
      },
      
      // Event Actions
      addEvent: (eventData) => {
        const newEvent: Event = {
          ...eventData,
          id: generateId(),
          created_at: new Date().toISOString(),
          participants: eventData.invited_users.map((userId) => ({
            id: generateId(),
            event_id: '',
            user_id: userId,
            response: 'pending' as EventResponse,
            updated_at: new Date().toISOString(),
          })),
        };
        newEvent.participants = newEvent.participants!.map((p) => ({
          ...p,
          event_id: newEvent.id,
        }));
        set((state) => ({ events: [...state.events, newEvent] }));
      },
      
      updateEvent: (id, updates) => {
        set((state) => ({
          events: state.events.map((e) =>
            e.id === id ? { ...e, ...updates, updated_at: new Date().toISOString() } : e
          ),
        }));
      },
      
      deleteEvent: (id) => {
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        }));
      },
      
      updateEventResponse: (eventId, userId, response) => {
        set((state) => ({
          events: state.events.map((e) => {
            if (e.id !== eventId) return e;
            const participants = e.participants?.map((p) =>
              p.user_id === userId ? { ...p, response, updated_at: new Date().toISOString() } : p
            ) || [];
            return { ...e, participants };
          }),
        }));
      },
      
      // Wishlist Actions
      addWishlistItem: (itemData) => {
        const newItem: WishlistItem = {
          ...itemData,
          id: generateId(),
          is_booked: false,
          created_at: new Date().toISOString(),
        };
        set((state) => ({ wishlistItems: [...state.wishlistItems, newItem] }));
      },
      
      updateWishlistItem: (id, updates) => {
        set((state) => ({
          wishlistItems: state.wishlistItems.map((w) =>
            w.id === id ? { ...w, ...updates } : w
          ),
        }));
      },
      
      deleteWishlistItem: (id) => {
        set((state) => ({
          wishlistItems: state.wishlistItems.filter((w) => w.id !== id),
        }));
      },
      
      bookWishlistItem: (itemId, userId) => {
        set((state) => ({
          wishlistItems: state.wishlistItems.map((w) =>
            w.id === itemId
              ? { ...w, is_booked: true, booked_by: userId, booked_at: new Date().toISOString() }
              : w
          ),
        }));
      },
      
      cancelBooking: (itemId) => {
        set((state) => ({
          wishlistItems: state.wishlistItems.map((w) =>
            w.id === itemId
              ? { ...w, is_booked: false, booked_by: undefined, booked_at: undefined }
              : w
          ),
        }));
      },
      
      // Friend Actions
      sendFriendRequest: (receiverId) => {
        const { currentUser, friendRequests } = get();
        // Check if request already exists
        const existing = friendRequests.find(
          (r) =>
            (r.sender_id === currentUser.id && r.receiver_id === receiverId) ||
            (r.sender_id === receiverId && r.receiver_id === currentUser.id)
        );
        if (existing) return;
        
        const newRequest: FriendRequest = {
          id: generateId(),
          sender_id: currentUser.id,
          receiver_id: receiverId,
          status: 'pending',
          created_at: new Date().toISOString(),
        };
        set((state) => ({ friendRequests: [...state.friendRequests, newRequest] }));
      },
      
      acceptFriendRequest: (requestId) => {
        const { friendRequests, friendships } = get();
        const request = friendRequests.find((r) => r.id === requestId);
        if (!request) return;
        
        // Create bidirectional friendship
        const fs1: Friendship = {
          id: generateId(),
          user_id: request.sender_id,
          friend_id: request.receiver_id,
          created_at: new Date().toISOString(),
        };
        const fs2: Friendship = {
          id: generateId(),
          user_id: request.receiver_id,
          friend_id: request.sender_id,
          created_at: new Date().toISOString(),
        };
        
        set((state) => ({
          friendRequests: state.friendRequests.map((r) =>
            r.id === requestId ? { ...r, status: 'accepted' } : r
          ),
          friendships: [...state.friendships, fs1, fs2],
        }));
      },
      
      declineFriendRequest: (requestId) => {
        set((state) => ({
          friendRequests: state.friendRequests.map((r) =>
            r.id === requestId ? { ...r, status: 'declined' } : r
          ),
        }));
      },
      
      removeFriend: (friendId) => {
        const { currentUser } = get();
        set((state) => ({
          friendships: state.friendships.filter(
            (f) => !((f.user_id === currentUser.id && f.friend_id === friendId) || 
                     (f.user_id === friendId && f.friend_id === currentUser.id))
          ),
        }));
      },
      
      // Family Actions
      createFamily: (name) => {
        const { currentUser } = get();
        const newFamily: FamilyGroup = {
          id: generateId(),
          name,
          created_by: currentUser.id,
          members: [
            {
              id: generateId(),
              family_id: '',
              user_id: currentUser.id,
              role: 'admin',
              joined_at: new Date().toISOString(),
              user: currentUser,
            },
          ],
        };
        newFamily.members[0].family_id = newFamily.id;
        set((state) => ({
          families: [...state.families, newFamily],
          selectedFamilyId: newFamily.id,
        }));
      },
      
      inviteToFamily: (familyId, userId) => {
        const { users } = get();
        const user = users.find((u) => u.id === userId);
        if (!user) return;
        
        const newMember = {
          id: generateId(),
          family_id: familyId,
          user_id: userId,
          role: 'member' as const,
          joined_at: new Date().toISOString(),
          user,
        };
        
        set((state) => ({
          families: state.families.map((f) =>
            f.id === familyId
              ? { ...f, members: [...(f.members || []), newMember] }
              : f
          ),
        }));
      },
      
      leaveFamily: (familyId) => {
        const { currentUser, families } = get();
        const family = families.find((f) => f.id === familyId);
        if (!family) return;
        
        // If admin and only member, delete family
        const members = family.members || [];
        const isAdmin = members.some(
          (m) => m.user_id === currentUser.id && m.role === 'admin'
        );
        
        if (isAdmin && members.length === 1) {
          set((state) => ({
            families: state.families.filter((f) => f.id !== familyId),
            selectedFamilyId: state.families.find((f) => f.id !== familyId)?.id || null,
          }));
        } else {
          set((state) => ({
            families: state.families.map((f) =>
              f.id === familyId
                ? {
                    ...f,
                    members: (f.members || []).filter((m) => m.user_id !== currentUser.id),
                  }
                : f
            ),
            selectedFamilyId: state.families.find((f) => f.id !== familyId)?.id || null,
          }));
        }
      },
      
      removeMember: (familyId, userId) => {
        set((state) => ({
          families: state.families.map((f) =>
            f.id === familyId
              ? {
                  ...f,
                  members: (f.members || []).filter((m) => m.user_id !== userId),
                }
              : f
          ),
        }));
      },
      
      // Reset
      resetToDemo: () => set(initialState),
    }),
    {
      name: 'family-app-storage',
      partialize: (state) => ({
        // Persist user data
        currentUser: state.currentUser,
        tasks: state.tasks,
        events: state.events,
        wishlistItems: state.wishlistItems,
        friendships: state.friendships,
        friendRequests: state.friendRequests,
        families: state.families,
      }),
    }
  )
);

// Selectors
export const useCurrentFamily = () => {
  const { families, selectedFamilyId } = useAppStore();
  return families.find((f) => f.id === selectedFamilyId);
};

export const useActiveTasks = () => {
  const { tasks, selectedFamilyId } = useAppStore();
  return tasks.filter(
    (t) => t.family_id === selectedFamilyId && (t.status === 'active' || t.status === 'completed')
  );
};

export const useArchivedTasks = () => {
  const { tasks, selectedFamilyId } = useAppStore();
  return tasks.filter((t) => t.family_id === selectedFamilyId && t.status === 'archived');
};

export const useFriends = () => {
  const { friendships, currentUser, users } = useAppStore();
  const friendIds = friendships
    .filter((f) => f.user_id === currentUser.id)
    .map((f) => f.friend_id);
  return users.filter((u) => friendIds.includes(u.id));
};

export const usePendingFriendRequests = () => {
  const { friendRequests, currentUser } = useAppStore();
  return friendRequests.filter(
    (r) => r.receiver_id === currentUser.id && r.status === 'pending'
  );
};

export const useMyEvents = () => {
  const { events, currentUser } = useAppStore();
  return events.filter(
    (e) => e.created_by === currentUser.id || e.invited_users.includes(currentUser.id)
  );
};

export const useMyWishlist = () => {
  const { wishlistItems, currentUser } = useAppStore();
  return wishlistItems.filter((w) => w.user_id === currentUser.id);
};

export const useFriendWishlist = (friendId: string) => {
  const { wishlistItems, currentUser } = useAppStore();
  return wishlistItems
    .filter((w) => w.user_id === friendId)
    .map((w) => ({
      ...w,
      // Hide booked_by from wishlist owner
      booked_by: w.user_id === currentUser.id ? w.booked_by : undefined,
    }));
};
