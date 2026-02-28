// =====================================================
// Family App - Demo Data for Local Testing
// =====================================================

import { User, FamilyGroup, FamilyMember, Friendship, FriendRequest, TaskCategory, Task, Event, EventParticipant, WishlistItem } from '@/types';

// Demo users
export const demoUsers: User[] = [
  {
    id: '1',
    telegram_id: 123456789,
    username: 'ivan_ivanov',
    first_name: 'Иван',
    last_name: 'Иванов',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan',
    birthday: '1990-05-15',
    show_birthday: true,
  },
  {
    id: '2',
    telegram_id: 987654321,
    username: 'maria_ivanova',
    first_name: 'Мария',
    last_name: 'Иванова',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    birthday: '1992-08-22',
    show_birthday: true,
  },
  {
    id: '3',
    telegram_id: 555555555,
    username: 'petr_petrov',
    first_name: 'Пётр',
    last_name: 'Петров',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Petr',
    birthday: '1988-03-10',
    show_birthday: false,
  },
  {
    id: '4',
    telegram_id: 777777777,
    username: 'anna_sidorova',
    first_name: 'Анна',
    last_name: 'Сидорова',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
    birthday: '1995-12-01',
    show_birthday: true,
  },
  {
    id: '5',
    telegram_id: 999999999,
    username: 'alex_smirnov',
    first_name: 'Александр',
    last_name: 'Смирнов',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    birthday: '1993-07-20',
    show_birthday: true,
  },
];

// Current user (demo)
export const currentUser: User = demoUsers[0];

// Demo families
export const demoFamilies: FamilyGroup[] = [
  {
    id: 'f1',
    name: 'Семья Ивановых',
    created_by: '1',
    members: [
      { id: 'fm1', family_id: 'f1', user_id: '1', role: 'admin', joined_at: new Date().toISOString(), user: demoUsers[0] },
      { id: 'fm2', family_id: 'f1', user_id: '2', role: 'member', joined_at: new Date().toISOString(), user: demoUsers[1] },
    ],
  },
  {
    id: 'f2',
    name: 'Родители',
    created_by: '1',
    members: [
      { id: 'fm3', family_id: 'f2', user_id: '1', role: 'admin', joined_at: new Date().toISOString(), user: demoUsers[0] },
    ],
  },
];

// Demo friendships
export const demoFriendships: Friendship[] = [
  { id: 'fs1', user_id: '1', friend_id: '3', created_at: new Date(Date.now() - 86400000 * 30).toISOString(), friend: demoUsers[2] },
  { id: 'fs2', user_id: '3', friend_id: '1', created_at: new Date(Date.now() - 86400000 * 30).toISOString() },
  { id: 'fs3', user_id: '1', friend_id: '4', created_at: new Date(Date.now() - 86400000 * 14).toISOString(), friend: demoUsers[3] },
  { id: 'fs4', user_id: '4', friend_id: '1', created_at: new Date(Date.now() - 86400000 * 14).toISOString() },
  { id: 'fs5', user_id: '1', friend_id: '5', created_at: new Date(Date.now() - 86400000 * 7).toISOString(), friend: demoUsers[4] },
  { id: 'fs6', user_id: '5', friend_id: '1', created_at: new Date(Date.now() - 86400000 * 7).toISOString() },
];

// Demo friend requests
export const demoFriendRequests: FriendRequest[] = [
  {
    id: 'fr1',
    sender_id: '2',
    receiver_id: '3',
    status: 'pending',
    created_at: new Date().toISOString(),
    sender: demoUsers[1],
    receiver: demoUsers[2],
  },
];

// Demo task categories
export const demoCategories: TaskCategory[] = [
  // Shopping categories
  { id: 'c1', name: 'Молочное', icon: 'Milk', type: 'shopping', order: 1 },
  { id: 'c2', name: 'Мясо/Рыба', icon: 'Beef', type: 'shopping', order: 2 },
  { id: 'c3', name: 'Бакалея', icon: 'Package', type: 'shopping', order: 3 },
  { id: 'c4', name: 'Овощи/Фрукты', icon: 'Apple', type: 'shopping', order: 4 },
  { id: 'c5', name: 'Напитки', icon: 'CupSoda', type: 'shopping', order: 5 },
  { id: 'c6', name: 'Хлеб/Выпечка', icon: 'Croissant', type: 'shopping', order: 6 },
  { id: 'c7', name: 'Маркетплейсы', icon: 'ShoppingBag', type: 'shopping', order: 7 },
  { id: 'c8', name: 'Аптека', icon: 'Pill', type: 'shopping', order: 8 },
  { id: 'c9', name: 'Бытовая химия', icon: 'SprayCan', type: 'shopping', order: 9 },
  { id: 'c10', name: 'Другое', icon: 'ShoppingCart', type: 'shopping', order: 10 },
  // Home categories
  { id: 'c11', name: 'Уборка', icon: 'Home', type: 'home', order: 1 },
  { id: 'c12', name: 'Ремонт', icon: 'Hammer', type: 'home', order: 2 },
  { id: 'c13', name: 'Сад/Огород', icon: 'Trees', type: 'home', order: 3 },
  { id: 'c14', name: 'Готовка', icon: 'ChefHat', type: 'home', order: 4 },
  { id: 'c15', name: 'Другое', icon: 'House', type: 'home', order: 5 },
  // Other categories
  { id: 'c16', name: 'Документы', icon: 'FileText', type: 'other', order: 1 },
  { id: 'c17', name: 'Звонки', icon: 'Phone', type: 'other', order: 2 },
  { id: 'c18', name: 'Встречи', icon: 'Users', type: 'other', order: 3 },
  { id: 'c19', name: 'Другое', icon: 'ListTodo', type: 'other', order: 4 },
];

// Demo tasks
export const demoTasks: Task[] = [
  {
    id: 't1',
    family_id: 'f1',
    created_by: '1',
    type: 'shopping',
    category_id: 'c1',
    title: 'Молоко',
    description: 'Желательно 3.2%',
    quantity: 2,
    unit: 'л',
    assigned_to: ['1', '2'],
    status: 'active',
    created_at: new Date().toISOString(),
    category: demoCategories.find(c => c.id === 'c1'),
    creator: demoUsers[0],
    assignedUsers: [demoUsers[0], demoUsers[1]],
  },
  {
    id: 't2',
    family_id: 'f1',
    created_by: '2',
    type: 'shopping',
    category_id: 'c2',
    title: 'Куриная грудка',
    description: 'Для салата Цезарь',
    quantity: 1,
    unit: 'кг',
    assigned_to: [],
    status: 'active',
    created_at: new Date().toISOString(),
    category: demoCategories.find(c => c.id === 'c2'),
    creator: demoUsers[1],
    assignedUsers: [],
  },
  {
    id: 't3',
    family_id: 'f1',
    created_by: '1',
    type: 'shopping',
    category_id: 'c4',
    title: 'Яблоки Голден',
    quantity: 5,
    unit: 'шт',
    assigned_to: ['1'],
    status: 'completed',
    completed_at: new Date().toISOString(),
    completed_by: '1',
    created_at: new Date().toISOString(),
    category: demoCategories.find(c => c.id === 'c4'),
    creator: demoUsers[0],
    assignedUsers: [demoUsers[0]],
  },
  {
    id: 't4',
    family_id: 'f1',
    created_by: '1',
    type: 'home',
    category_id: 'c11',
    title: 'Помыть окна',
    description: 'На кухне и в спальне',
    assigned_to: ['2'],
    status: 'active',
    created_at: new Date().toISOString(),
    category: demoCategories.find(c => c.id === 'c11'),
    creator: demoUsers[0],
    assignedUsers: [demoUsers[1]],
  },
  {
    id: 't5',
    family_id: 'f1',
    created_by: '2',
    type: 'shopping',
    category_id: 'c5',
    title: 'Сок апельсиновый',
    quantity: 1,
    unit: 'л',
    assigned_to: [],
    status: 'completed',
    completed_at: new Date().toISOString(),
    completed_by: '2',
    created_at: new Date().toISOString(),
    category: demoCategories.find(c => c.id === 'c5'),
    creator: demoUsers[1],
    assignedUsers: [],
  },
  {
    id: 't6',
    family_id: 'f1',
    created_by: '1',
    type: 'shopping',
    category_id: 'c6',
    title: 'Хлеб белый',
    quantity: 1,
    unit: 'батон',
    assigned_to: [],
    status: 'archived',
    completed_at: new Date(Date.now() - 86400000).toISOString(),
    completed_by: '1',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    category: demoCategories.find(c => c.id === 'c6'),
    creator: demoUsers[0],
    assignedUsers: [],
  },
  {
    id: 't7',
    family_id: 'f1',
    created_by: '2',
    type: 'home',
    category_id: 'c14',
    title: 'Приготовить ужин',
    description: 'Паста карбонара',
    assigned_to: ['2'],
    status: 'active',
    created_at: new Date().toISOString(),
    category: demoCategories.find(c => c.id === 'c14'),
    creator: demoUsers[1],
    assignedUsers: [demoUsers[1]],
  },
  {
    id: 't8',
    family_id: 'f1',
    created_by: '1',
    type: 'other',
    category_id: 'c16',
    title: 'Оплатить коммунальные',
    assigned_to: ['1'],
    status: 'active',
    created_at: new Date().toISOString(),
    category: demoCategories.find(c => c.id === 'c16'),
    creator: demoUsers[0],
    assignedUsers: [demoUsers[0]],
  },
];

// Demo events
export const demoEvents: Event[] = [
  {
    id: 'e1',
    created_by: '1',
    title: 'День рождения Маши',
    description: 'Отмечаем дома, приходите все! Будет торт и напитки.',
    location: 'Квартира Ивановых, ул. Ленина 15, кв. 42',
    event_date: new Date(Date.now() + 7 * 86400000).toISOString(),
    invited_users: ['2', '3', '4', '5'],
    created_at: new Date().toISOString(),
    creator: demoUsers[0],
    participants: [
      { id: 'ep1', event_id: 'e1', user_id: '2', response: 'going', updated_at: new Date().toISOString(), user: demoUsers[1] },
      { id: 'ep2', event_id: 'e1', user_id: '3', response: 'pending', updated_at: new Date().toISOString(), user: demoUsers[2] },
      { id: 'ep3', event_id: 'e1', user_id: '4', response: 'going', updated_at: new Date().toISOString(), user: demoUsers[3] },
      { id: 'ep4', event_id: 'e1', user_id: '5', response: 'not_going', updated_at: new Date().toISOString(), user: demoUsers[4] },
    ],
  },
  {
    id: 'e2',
    created_by: '3',
    title: 'Поход в кино',
    description: 'Новый фильм Marvel - "Дэдпул и Росомаха"',
    location: 'ТЦ Европа, кинотеатр Киномакс',
    event_date: new Date(Date.now() + 3 * 86400000).toISOString(),
    invited_users: ['1'],
    created_at: new Date().toISOString(),
    creator: demoUsers[2],
    participants: [
      { id: 'ep5', event_id: 'e2', user_id: '1', response: 'pending', updated_at: new Date().toISOString(), user: demoUsers[0] },
    ],
  },
  {
    id: 'e3',
    created_by: '4',
    title: 'Пикник в парке',
    description: 'Выезд на природу, берём еду и напитки',
    location: 'Горький парк, главная аллея',
    event_date: new Date(Date.now() + 14 * 86400000).toISOString(),
    invited_users: ['1', '3'],
    created_at: new Date().toISOString(),
    creator: demoUsers[3],
    participants: [
      { id: 'ep6', event_id: 'e3', user_id: '1', response: 'going', updated_at: new Date().toISOString(), user: demoUsers[0] },
      { id: 'ep7', event_id: 'e3', user_id: '3', response: 'pending', updated_at: new Date().toISOString(), user: demoUsers[2] },
    ],
  },
];

// Demo wishlist items
export const demoWishlistItems: WishlistItem[] = [
  {
    id: 'w1',
    user_id: '1',
    title: 'Наушники Sony WH-1000XM5',
    description: 'Беспроводные наушники с активным шумоподавлением. Лучший выбор для работы и путешествий.',
    link: 'https://market.yandex.ru/product--naushniki-sony-wh-1000xm5',
    price: 35000,
    is_booked: false,
    created_at: new Date().toISOString(),
    user: demoUsers[0],
  },
  {
    id: 'w2',
    user_id: '1',
    title: 'Книга "Атомные привычки"',
    description: 'Джеймс Клир - Как приобретать полезные привычки и избавляться от вредных',
    link: 'https://www.ozon.ru/product/kniga-atomnye-privychki',
    price: 800,
    is_booked: false,
    created_at: new Date().toISOString(),
    user: demoUsers[0],
  },
  {
    id: 'w3',
    user_id: '1',
    title: 'Подписка на Яндекс.Плюс',
    description: 'Годовая подписка на музыку, кино и такси',
    price: 2999,
    is_booked: true,
    booked_by: '3',
    booked_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    user: demoUsers[0],
  },
  {
    id: 'w4',
    user_id: '2',
    title: 'Подарочный сертификат Ozon',
    description: 'Любая сумма, сам выберу что хочу',
    price: 5000,
    is_booked: true,
    booked_by: '3',
    booked_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    user: demoUsers[1],
  },
  {
    id: 'w5',
    user_id: '2',
    title: 'Набор контейнеров для хранения',
    description: 'Стеклянные, герметичные',
    price: 2500,
    is_booked: false,
    created_at: new Date().toISOString(),
    user: demoUsers[1],
  },
  {
    id: 'w6',
    user_id: '3',
    title: 'Футболка с принтом Star Wars',
    description: 'Размер M, желательно чёрная',
    price: 1500,
    is_booked: false,
    created_at: new Date().toISOString(),
    user: demoUsers[2],
  },
  {
    id: 'w7',
    user_id: '4',
    title: 'Абонемент в фитнес-клуб',
    description: 'На 3 месяца',
    price: 9000,
    is_booked: false,
    created_at: new Date().toISOString(),
    user: demoUsers[3],
  },
  {
    id: 'w8',
    user_id: '5',
    title: 'Умная колонка Яндекс.Станция',
    description: 'С Алисой, для умного дома',
    price: 6000,
    is_booked: false,
    created_at: new Date().toISOString(),
    user: demoUsers[4],
  },
];

// Helper to get user by ID
export const getUserById = (id: string): User | undefined => {
  return demoUsers.find(u => u.id === id);
};

// Helper to get category by ID
export const getCategoryById = (id: string): TaskCategory | undefined => {
  return demoCategories.find(c => c.id === id);
};

// Category colors for UI
export const categoryColors: Record<string, { bg: string; gradient: string }> = {
  'c1': { bg: 'bg-blue-100', gradient: 'from-blue-400 to-blue-600' },
  'c2': { bg: 'bg-red-100', gradient: 'from-red-400 to-red-600' },
  'c3': { bg: 'bg-amber-100', gradient: 'from-amber-400 to-amber-600' },
  'c4': { bg: 'bg-green-100', gradient: 'from-green-400 to-green-600' },
  'c5': { bg: 'bg-orange-100', gradient: 'from-orange-400 to-orange-600' },
  'c6': { bg: 'bg-yellow-100', gradient: 'from-yellow-400 to-yellow-600' },
  'c7': { bg: 'bg-purple-100', gradient: 'from-purple-400 to-purple-600' },
  'c8': { bg: 'bg-pink-100', gradient: 'from-pink-400 to-pink-600' },
  'c9': { bg: 'bg-cyan-100', gradient: 'from-cyan-400 to-cyan-600' },
  'c10': { bg: 'bg-gray-100', gradient: 'from-gray-400 to-gray-600' },
  'c11': { bg: 'bg-teal-100', gradient: 'from-teal-400 to-teal-600' },
  'c12': { bg: 'bg-stone-100', gradient: 'from-stone-400 to-stone-600' },
  'c13': { bg: 'bg-lime-100', gradient: 'from-lime-400 to-lime-600' },
  'c14': { bg: 'bg-rose-100', gradient: 'from-rose-400 to-rose-600' },
  'c15': { bg: 'bg-slate-100', gradient: 'from-slate-400 to-slate-600' },
  'c16': { bg: 'bg-indigo-100', gradient: 'from-indigo-400 to-indigo-600' },
  'c17': { bg: 'bg-emerald-100', gradient: 'from-emerald-400 to-emerald-600' },
  'c18': { bg: 'bg-violet-100', gradient: 'from-violet-400 to-violet-600' },
  'c19': { bg: 'bg-zinc-100', gradient: 'from-zinc-400 to-zinc-600' },
};

// Default color for unknown categories
export const defaultCategoryColor = { bg: 'bg-gray-100', gradient: 'from-gray-400 to-gray-600' };
