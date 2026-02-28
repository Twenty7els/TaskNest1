'use client';

import { TabId } from '@/types';
import { ListTodo, Calendar, Heart, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  isDark?: boolean;
}

const tabs: { id: TabId; icon: typeof ListTodo }[] = [
  { id: 'tasks', label: 'Задачи', icon: ListTodo },
  { id: 'events', label: 'Мероприятия', icon: Calendar },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'profile', label: 'Профиль', icon: User },
];

export function BottomNav({ activeTab, onTabChange, isDark: isDarkProp }: BottomNavProps) {
  const isDark = isDarkProp ?? activeTab === 'wishlist';

  return (
    <nav className={cn(
      "fixed bottom-4 left-4 right-4 rounded-2xl shadow-lg z-50 safe-bottom transition-all duration-300",
      isDark 
        ? "bg-black shadow-black/30 border border-white/20" 
        : "bg-white shadow-black/10"
    )}>
      <div className="max-w-lg mx-auto">
        <div className="flex justify-around items-center h-14">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'relative flex items-center justify-center w-full h-full transition-all duration-200 touch-active',
                  isActive 
                    ? isDark ? 'text-white' : 'text-black'
                    : isDark ? 'text-gray-500 active:text-gray-400' : 'text-gray-400 active:text-gray-600'
                )}
                style={{ minHeight: '44px' }}
              >
                <Icon
                  className={cn(
                    'transition-all duration-200',
                    isActive ? 'w-6 h-6' : 'w-6 h-6'
                  )}
                />
                {isActive && (
                  <span className={cn(
                    "absolute -bottom-1 w-1 h-1 rounded-full",
                    isDark ? "bg-white" : "bg-black"
                  )} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
