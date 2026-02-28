// =====================================================
// API Service - Hybrid Demo/Production Data Access
// =====================================================

import { config } from './config';
import { useAppStore } from './demo-store';

// Types
import { Task, Event, WishlistItem, User, FamilyGroup, FriendRequest } from '@/types';

// API base URL
const API_BASE = '/api';

// Generic fetch helper
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
// TASKS API
// =====================================================

export const tasksApi = {
  // Get tasks for a family
  async getByFamily(familyId: string, status?: string): Promise<Task[]> {
    if (config.useDemoData) {
      const { tasks } = useAppStore.getState();
      return tasks.filter(
        (t) => t.family_id === familyId && (status ? t.status === status : true)
      );
    }

    const { data, error } = await apiFetch<Task[]>(
      `/tasks?family_id=${familyId}&status=${status || 'all'}`
    );

    if (error) console.error('Error fetching tasks:', error);
    return data || [];
  },

  // Create task
  async create(task: Partial<Task>): Promise<Task | null> {
    if (config.useDemoData) {
      const store = useAppStore.getState();
      const newTask: Task = {
        id: Math.random().toString(36).substring(2, 15),
        family_id: task.family_id!,
        created_by: task.created_by!,
        type: task.type!,
        category_id: task.category_id || null,
        title: task.title!,
        description: task.description || null,
        quantity: task.quantity || null,
        unit: task.unit || null,
        assigned_to: task.assigned_to || [],
        status: 'active',
        created_at: new Date().toISOString(),
      };
      store.addTask(newTask);
      return newTask;
    }

    const { data, error } = await apiFetch<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });

    if (error) console.error('Error creating task:', error);
    return data;
  },

  // Complete task
  async complete(taskId: string): Promise<boolean> {
    if (config.useDemoData) {
      useAppStore.getState().completeTask(taskId);
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

    return !error;
  },

  // Archive task
  async archive(taskId: string): Promise<boolean> {
    if (config.useDemoData) {
      useAppStore.getState().archiveTask(taskId);
      return true;
    }

    const { error } = await apiFetch('/tasks', {
      method: 'PATCH',
      body: JSON.stringify({
        id: taskId,
        status: 'archived',
      }),
    });

    return !error;
  },

  // Delete task
  async delete(taskId: string): Promise<boolean> {
    if (config.useDemoData) {
      useAppStore.getState().deleteTask(taskId);
      return true;
    }

    const { error } = await apiFetch(`/tasks?id=${taskId}`, {
      method: 'DELETE',
    });

    return !error;
  },
};

// =====================================================
// EVENTS API
// =====================================================

export const eventsApi = {
  async getByUser(userId: string): Promise<Event[]> {
    if (config.useDemoData) {
      const { events } = useAppStore.getState();
      return events.filter(
        (e) => e.created_by === userId || e.invited_users.includes(userId)
      );
    }

    const { data, error } = await apiFetch<Event[]>(`/events?user_id=${userId}`);
    if (error) console.error('Error fetching events:', error);
    return data || [];
  },

  async create(event: Partial<Event>): Promise<Event | null> {
    if (config.useDemoData) {
      const store = useAppStore.getState();
      const newEvent: Event = {
        id: Math.random().toString(36).substring(2, 15),
        created_by: event.created_by!,
        title: event.title!,
        description: event.description || null,
        location: event.location || null,
        event_date: event.event_date!,
        invited_users: event.invited_users || [],
        created_at: new Date().toISOString(),
        participants: [],
      };
      store.addEvent(newEvent);
      return newEvent;
    }

    const { data, error } = await apiFetch<Event>('/events', {
      method: 'POST',
      body: JSON.stringify(event),
    });

    if (error) console.error('Error creating event:', error);
    return data;
  },

  async updateResponse(
    eventId: string,
    userId: string,
    response: 'going' | 'not_going'
  ): Promise<boolean> {
    if (config.useDemoData) {
      useAppStore.getState().updateEventResponse(eventId, userId, response);
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

    return !error;
  },

  async delete(eventId: string): Promise<boolean> {
    if (config.useDemoData) {
      useAppStore.getState().deleteEvent(eventId);
      return true;
    }

    const { error } = await apiFetch(`/events?id=${eventId}`, {
      method: 'DELETE',
    });

    return !error;
  },
};

// =====================================================
// WISHLIST API
// =====================================================

export const wishlistApi = {
  async getByUser(userId: string): Promise<WishlistItem[]> {
    if (config.useDemoData) {
      const { wishlistItems } = useAppStore.getState();
      return wishlistItems.filter((w) => w.user_id === userId);
    }

    const { data, error } = await apiFetch<WishlistItem[]>(
      `/wishlist?user_id=${userId}`
    );
    if (error) console.error('Error fetching wishlist:', error);
    return data || [];
  },

  async create(item: Partial<WishlistItem>): Promise<WishlistItem | null> {
    if (config.useDemoData) {
      const store = useAppStore.getState();
      const newItem: WishlistItem = {
        id: Math.random().toString(36).substring(2, 15),
        user_id: item.user_id!,
        title: item.title!,
        description: item.description || null,
        link: item.link || null,
        price: item.price || null,
        is_booked: false,
        created_at: new Date().toISOString(),
      };
      store.addWishlistItem(newItem);
      return newItem;
    }

    const { data, error } = await apiFetch<WishlistItem>('/wishlist', {
      method: 'POST',
      body: JSON.stringify(item),
    });

    if (error) console.error('Error creating wishlist item:', error);
    return data;
  },

  async book(itemId: string, userId: string): Promise<boolean> {
    if (config.useDemoData) {
      useAppStore.getState().bookWishlistItem(itemId, userId);
      return true;
    }

    const { error } = await apiFetch('/wishlist', {
      method: 'PATCH',
      body: JSON.stringify({
        action: 'book',
        item_id: itemId,
        booked_by: userId,
      }),
    });

    return !error;
  },

  async cancelBooking(itemId: string): Promise<boolean> {
    if (config.useDemoData) {
      useAppStore.getState().cancelBooking(itemId);
      return true;
    }

    const { error } = await apiFetch('/wishlist', {
      method: 'PATCH',
      body: JSON.stringify({
        action: 'cancel',
        item_id: itemId,
      }),
    });

    return !error;
  },

  async delete(itemId: string): Promise<boolean> {
    if (config.useDemoData) {
      useAppStore.getState().deleteWishlistItem(itemId);
      return true;
    }

    const { error } = await apiFetch(`/wishlist?id=${itemId}`, {
      method: 'DELETE',
    });

    return !error;
  },
};

// =====================================================
// USERS API
// =====================================================

export const usersApi = {
  async search(query: string): Promise<User[]> {
    if (config.useDemoData) {
      const { users, currentUser } = useAppStore.getState();
      return users.filter(
        (u) =>
          u.id !== currentUser.id &&
          (u.username?.toLowerCase().includes(query.toLowerCase()) ||
            u.first_name.toLowerCase().includes(query.toLowerCase()))
      );
    }

    const { data, error } = await apiFetch<User[]>(`/users?search=${query}`);
    if (error) console.error('Error searching users:', error);
    return data || [];
  },

  async getById(userId: string): Promise<User | null> {
    if (config.useDemoData) {
      const { users } = useAppStore.getState();
      return users.find((u) => u.id === userId) || null;
    }

    const { data, error } = await apiFetch<User>(`/users?id=${userId}`);
    if (error) console.error('Error fetching user:', error);
    return data;
  },

  async createOrUpdate(userData: Partial<User>): Promise<User | null> {
    if (config.useDemoData) {
      // In demo mode, current user is already set
      return useAppStore.getState().currentUser;
    }

    const { data, error } = await apiFetch<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (error) console.error('Error creating/updating user:', error);
    return data;
  },
};

// =====================================================
// FRIENDS API
// =====================================================

export const friendsApi = {
  async getFriends(userId: string): Promise<User[]> {
    if (config.useDemoData) {
      const { friendships, users, currentUser } = useAppStore.getState();
      const friendIds = friendships
        .filter((f) => f.user_id === currentUser.id)
        .map((f) => f.friend_id);
      return users.filter((u) => friendIds.includes(u.id));
    }

    const { data, error } = await apiFetch<User[]>(`/friends?user_id=${userId}`);
    if (error) console.error('Error fetching friends:', error);
    return data || [];
  },

  async getPendingRequests(userId: string): Promise<FriendRequest[]> {
    if (config.useDemoData) {
      const { friendRequests, currentUser } = useAppStore.getState();
      return friendRequests.filter(
        (r) => r.receiver_id === currentUser.id && r.status === 'pending'
      );
    }

    const { data, error } = await apiFetch<FriendRequest[]>(
      `/friends?user_id=${userId}&type=requests`
    );
    if (error) console.error('Error fetching friend requests:', error);
    return data || [];
  },

  async sendRequest(senderId: string, receiverId: string): Promise<boolean> {
    if (config.useDemoData) {
      useAppStore.getState().sendFriendRequest(receiverId);
      return true;
    }

    const { error } = await apiFetch('/friends', {
      method: 'POST',
      body: JSON.stringify({
        sender_id: senderId,
        receiver_id: receiverId,
      }),
    });

    return !error;
  },

  async acceptRequest(requestId: string): Promise<boolean> {
    if (config.useDemoData) {
      useAppStore.getState().acceptFriendRequest(requestId);
      return true;
    }

    const { error } = await apiFetch('/friends', {
      method: 'PATCH',
      body: JSON.stringify({
        action: 'accept',
        request_id: requestId,
      }),
    });

    return !error;
  },

  async declineRequest(requestId: string): Promise<boolean> {
    if (config.useDemoData) {
      useAppStore.getState().declineFriendRequest(requestId);
      return true;
    }

    const { error } = await apiFetch('/friends', {
      method: 'PATCH',
      body: JSON.stringify({
        action: 'decline',
        request_id: requestId,
      }),
    });

    return !error;
  },
};

// =====================================================
// FAMILIES API
// =====================================================

export const familiesApi = {
  async getByUser(userId: string): Promise<FamilyGroup[]> {
    if (config.useDemoData) {
      const { families, currentUser } = useAppStore.getState();
      return families.filter((f) =>
        f.members?.some((m) => m.user_id === currentUser.id)
      );
    }

    const { data, error } = await apiFetch<FamilyGroup[]>(
      `/families?user_id=${userId}`
    );
    if (error) console.error('Error fetching families:', error);
    return data || [];
  },

  async create(name: string, createdBy: string): Promise<FamilyGroup | null> {
    if (config.useDemoData) {
      useAppStore.getState().createFamily(name);
      return null;
    }

    const { data, error } = await apiFetch<FamilyGroup>('/families', {
      method: 'POST',
      body: JSON.stringify({
        name,
        created_by: createdBy,
      }),
    });

    if (error) console.error('Error creating family:', error);
    return data;
  },

  async invite(familyId: string, userId: string): Promise<boolean> {
    if (config.useDemoData) {
      useAppStore.getState().inviteToFamily(familyId, userId);
      return true;
    }

    const { error } = await apiFetch('/families', {
      method: 'PATCH',
      body: JSON.stringify({
        action: 'invite',
        family_id: familyId,
        user_id: userId,
      }),
    });

    return !error;
  },

  async leave(familyId: string, userId: string): Promise<boolean> {
    if (config.useDemoData) {
      useAppStore.getState().leaveFamily(familyId);
      return true;
    }

    const { error } = await apiFetch('/families', {
      method: 'PATCH',
      body: JSON.stringify({
        action: 'leave',
        family_id: familyId,
        user_id: userId,
      }),
    });

    return !error;
  },
};
