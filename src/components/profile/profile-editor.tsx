'use client';

import { useState } from 'react';
import { Calendar, Eye, EyeOff, Pencil } from 'lucide-react';
import { User } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ProfileEditorProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdate: (updates: Partial<User>) => void;
}

export function ProfileEditor({
  isOpen,
  onClose,
  user,
  onUpdate,
}: ProfileEditorProps) {
  const [birthday, setBirthday] = useState(user.birthday || '');
  const [showBirthday, setShowBirthday] = useState(user.show_birthday ?? true);

  const handleSave = () => {
    onUpdate({
      birthday: birthday || null,
      show_birthday: showBirthday,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Редактировать профиль
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Avatar preview */}
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user.avatar_url || ''} />
              <AvatarFallback className="bg-gradient-to-br from-pink-400 to-rose-500 text-white text-xl">
                {user.first_name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-900">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-sm text-gray-500">@{user.username}</p>
            </div>
          </div>

          {/* Birthday section */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Дата рождения
            </label>
            
            <Input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full"
            />

            {/* Show birthday toggle */}
            <button
              onClick={() => setShowBirthday(!showBirthday)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-xl border transition-colors",
                showBirthday 
                  ? "border-blue-200 bg-blue-50" 
                  : "border-gray-200 bg-gray-50"
              )}
            >
              <div className="flex items-center gap-3">
                {showBirthday ? (
                  <Eye className="w-5 h-5 text-blue-500" />
                ) : (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                )}
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {showBirthday ? "Показывать друзьям" : "Скрыто от друзей"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {showBirthday 
                      ? "Друзья будут видеть вашу дату рождения" 
                      : "Только вы видите дату рождения"
                    }
                  </p>
                </div>
              </div>
              <div className={cn(
                "w-10 h-6 rounded-full transition-colors relative",
                showBirthday ? "bg-blue-500" : "bg-gray-300"
              )}>
                <div className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow",
                  showBirthday ? "translate-x-5" : "translate-x-1"
                )} />
              </div>
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1"
            >
              Сохранить
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
