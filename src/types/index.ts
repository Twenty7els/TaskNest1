// =====================================================
// Family App - TypeScript Types
// =====================================================

// User types
export interface User {
  id: string;
  telegram_id: number;
  username: string | null;
  first_name: string;
  last_name: string | null;
  avatar_url: string | null;
  birthday: string | null;
  show_birthday: boolean; // Whether to show birthday to friends
  chat_id?: number;
  created_at?: string;
}

// Friend request types
export type FriendRequestStatus = 'pending' | 'accepted' | 'declined';

export interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: FriendRequestStatus;
  created_at: string;
  sender?: User;
  receiver?: User;
}

// Friendship
export interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  created_at: string;
  friend?: User;
}

// Family types
export type FamilyMemberRole = 'admin' | 'member';

export interface FamilyGroup {
  id: string;
  name: string;
  created_by: string;
  created_at?: string;
  members?: FamilyMember[];
}

export interface FamilyMember {
  id: string;
  family_id: string;
  user_id: string;
  role: FamilyMemberRole;
  joined_at: string;
  user?: User;
}

// Task types
export type TaskType = 'shopping' | 'home' | 'other';
export type TaskStatus = 'active' | 'completed' | 'archived' | 'deleted';
export type TaskCategoryType = 'shopping' | 'home' | 'other';

export interface TaskCategory {
  id: string;
  name: string;
  icon: string;
  type: TaskCategoryType;
  order: number;
}

export interface Task {
  id: string;
  family_id: string;
  created_by: string;
  type: TaskType;
  category_id: string | null;
  title: string;
  description?: string | null;
  quantity?: number | null;
  unit?: string | null;
  assigned_to: string[];
  status: TaskStatus;
  completed_at?: string | null;
  completed_by?: string | null;
  created_at: string;
  updated_at?: string;
  category?: TaskCategory;
  creator?: User;
  assignedUsers?: User[];
}

// Event types
export type EventResponse = 'pending' | 'going' | 'not_going';

export interface Event {
  id: string;
  created_by: string;
  title: string;
  description?: string | null;
  location?: string | null;
  event_date: string;
  image_url?: string | null;
  invited_users: string[];
  created_at?: string;
  creator?: User;
  participants?: EventParticipant[];
}

export interface EventParticipant {
  id: string;
  event_id: string;
  user_id: string;
  response: EventResponse;
  updated_at: string;
  user?: User;
}

// Wishlist types
export interface WishlistItem {
  id: string;
  user_id: string;
  title: string;
  description?: string | null;
  link?: string | null;
  price?: number | null;
  image_url?: string | null;
  is_booked: boolean;
  booked_by?: string | null;
  booked_at?: string | null;
  created_at?: string;
  user?: User;
}

export interface WishlistBooking {
  id: string;
  item_id: string;
  user_id: string;
  booked_at: string;
  cancelled_at?: string | null;
}

// Archive
export interface Archive {
  id: string;
  task_id: string;
  completed_by: string;
  completed_at: string;
  archived_at: string;
  task?: Task;
  completedByUser?: User;
}

// Notification types
export type NotificationType =
  | 'friend_request'
  | 'friend_accepted'
  | 'family_invite'
  | 'task_assigned'
  | 'event_invite'
  | 'event_response'
  | 'wishlist_booked'
  | 'wishlist_cancelled';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  payload: Record<string, unknown>;
  read: boolean;
  created_at: string;
}

// Navigation
export type TabId = 'tasks' | 'events' | 'wishlist' | 'profile';

// UI State
export interface UIState {
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
}
