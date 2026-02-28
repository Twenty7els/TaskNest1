'use client';

import { useAppStore } from '@/lib/demo-store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FriendList } from './friend-list';
import { FamilyManager } from './family-manager';
import { Calendar, Cake, Settings, RefreshCw, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useState } from 'react';

export function UserProfile() {
  const currentUser = useAppStore((state) => state.currentUser);
  const resetToDemo = useAppStore((state) => state.resetToDemo);
  const [activeSection, setActiveSection] = useState<'main' | 'friends' | 'family'>('main');

  const formatBirthday = (birthday?: string) => {
    if (!birthday) return 'Не указан';
    return format(new Date(birthday), 'd MMMM', { locale: ru });
  };

  if (activeSection === 'friends') {
    return <FriendList onBack={() => setActiveSection('main')} />;
  }

  if (activeSection === 'family') {
    return <FamilyManager onBack={() => setActiveSection('main')} />;
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-20">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 pt-6 pb-16 relative">
        <div className="absolute top-4 right-4">
          <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Avatar & Info */}
      <div className="px-4 -mt-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 text-center"
        >
          <Avatar className="w-24 h-24 mx-auto border-4 border-white shadow-lg -mt-16 relative z-10">
            <AvatarImage src={currentUser.avatar_url} className="bg-gray-100" />
            <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-400 to-purple-500 text-white">
              {currentUser.first_name[0]}
              {currentUser.last_name[0]}
            </AvatarFallback>
          </Avatar>

          <h2 className="text-2xl font-bold text-gray-900 mt-4">
            {currentUser.first_name} {currentUser.last_name}
          </h2>
          
          <p className="text-gray-500">@{currentUser.username}</p>

          <div className="flex items-center justify-center gap-2 mt-3 text-gray-600">
            <Cake className="w-4 h-4" />
            <span className="text-sm">{formatBirthday(currentUser.birthday)}</span>
          </div>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="px-4 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
        >
          <Card className="bg-blue-50 border-0">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">12</p>
              <p className="text-xs text-gray-500">Задач</p>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 border-0">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-purple-600">5</p>
              <p className="text-xs text-gray-500">Событий</p>
            </CardContent>
          </Card>
          <Card className="bg-amber-50 border-0">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-amber-600">3</p>
              <p className="text-xs text-gray-500">Желаний</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Menu Items */}
      <div className="px-4 mt-4 space-y-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="outline"
            onClick={() => setActiveSection('friends')}
            className="w-full justify-start rounded-xl h-14 px-4 border-gray-200 hover:bg-blue-50"
          >
            <User className="w-5 h-5 mr-3 text-blue-500" />
            <span className="flex-1 text-left">Друзья</span>
            <Badge variant="secondary">3</Badge>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="outline"
            onClick={() => setActiveSection('family')}
            className="w-full justify-start rounded-xl h-14 px-4 border-gray-200 hover:bg-purple-50"
          >
            <Calendar className="w-5 h-5 mr-3 text-purple-500" />
            <span className="flex-1 text-left">Мои семьи</span>
            <Badge variant="secondary">2</Badge>
          </Button>
        </motion.div>
      </div>

      {/* Demo Reset Button */}
      <div className="px-4 mt-8">
        <Button
          variant="outline"
          onClick={resetToDemo}
          className="w-full rounded-xl text-gray-500"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Сбросить демо-данные
        </Button>
      </div>
    </div>
  );
}
