'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Event, User } from '@/types';
import { cn } from '@/lib/utils';

const eventSchema = z.object({
  title: z.string().min(1, 'Название обязательно'),
  description: z.string().optional(),
  location: z.string().optional(),
  event_date: z.string().min(1, 'Дата обязательна'),
  event_time: z.string().min(1, 'Время обязательно'),
  image_url: z.string().url('Некорректный URL').optional().or(z.literal('')),
  invited_users: z.array(z.string()).default([]),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Event, 'id' | 'created_at'>) => void;
  friends: User[];
  currentUser: User;
  editingEvent?: Event | null;
}

export function EventForm({
  isOpen,
  onClose,
  onSubmit,
  friends,
  currentUser,
  editingEvent,
}: EventFormProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>(
    editingEvent?.invited_users || []
  );

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: editingEvent?.title || '',
      description: editingEvent?.description || '',
      location: editingEvent?.location || '',
      event_date: editingEvent
        ? new Date(editingEvent.event_date).toISOString().split('T')[0]
        : '',
      event_time: editingEvent
        ? new Date(editingEvent.event_date).toTimeString().slice(0, 5)
        : '',
      image_url: editingEvent?.image_url || '',
      invited_users: editingEvent?.invited_users || [],
    },
  });

  const handleFormSubmit = (data: EventFormData) => {
    const eventDate = new Date(`${data.event_date}T${data.event_time}`);
    onSubmit({
      created_by: currentUser.id,
      title: data.title,
      description: data.description || null,
      location: data.location || null,
      event_date: eventDate.toISOString(),
      image_url: data.image_url || null,
      invited_users: selectedUsers,
      creator: currentUser,
      participants: selectedUsers.map((userId) => ({
        id: '',
        event_id: '',
        user_id: userId,
        response: 'pending' as const,
        updated_at: new Date().toISOString(),
      })),
    });
    reset();
    setSelectedUsers([]);
    onClose();
  };

  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAll = () => {
    setSelectedUsers(friends.map((f) => f.id));
  };

  const deselectAll = () => {
    setSelectedUsers([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingEvent ? 'Редактировать мероприятие' : 'Новое мероприятие'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Название *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="День рождения, Поход в кино..."
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Дополнительная информация..."
              rows={2}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Место</Label>
            <Input
              id="location"
              {...register('location')}
              placeholder="Адрес или название места"
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="image_url">Ссылка на изображение</Label>
            <Input
              id="image_url"
              {...register('image_url')}
              placeholder="https://example.com/image.jpg"
              type="url"
            />
            {errors.image_url && (
              <p className="text-sm text-red-500">{errors.image_url.message}</p>
            )}
            <p className="text-xs text-gray-400">
              Оставьте пустым для автоматического изображения
            </p>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="event_date">Дата *</Label>
              <Input
                id="event_date"
                type="date"
                {...register('event_date')}
              />
              {errors.event_date && (
                <p className="text-sm text-red-500">{errors.event_date.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="event_time">Время *</Label>
              <Input
                id="event_time"
                type="time"
                {...register('event_time')}
              />
              {errors.event_time && (
                <p className="text-sm text-red-500">{errors.event_time.message}</p>
              )}
            </div>
          </div>

          {/* Invite Users */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Пригласить друзей</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={selectAll}
                  className="text-xs h-7"
                >
                  Выбрать всех
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={deselectAll}
                  className="text-xs h-7"
                >
                  Сбросить
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
              {friends.map((friend) => (
                <button
                  key={friend.id}
                  type="button"
                  onClick={() => toggleUser(friend.id)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-full transition-all',
                    selectedUsers.includes(friend.id)
                      ? 'bg-purple-100 text-purple-700 ring-2 ring-purple-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  <Avatar className="w-5 h-5">
                    <AvatarImage src={friend.avatar_url || ''} />
                    <AvatarFallback className="text-xs">
                      {friend.first_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{friend.first_name}</span>
                  {selectedUsers.includes(friend.id) && (
                    <Check className="w-3 h-3" />
                  )}
                </button>
              ))}
            </div>
            {friends.length === 0 && (
              <p className="text-sm text-gray-400">Нет друзей для приглашения</p>
            )}
            <p className="text-xs text-gray-400">
              Если никого не выбрать, мероприятие увидят все ваши друзья
            </p>
          </div>

          {/* Submit */}
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Отмена
            </Button>
            <Button type="submit" className="flex-1">
              {editingEvent ? 'Сохранить' : 'Создать'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
