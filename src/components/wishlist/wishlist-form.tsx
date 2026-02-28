'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { WishlistItem } from '@/types';

const wishlistSchema = z.object({
  title: z.string().min(1, 'Название обязательно'),
  description: z.string().optional(),
  link: z.string().url('Неверный формат ссылки').optional().or(z.literal('')),
  price: z.number().min(0).optional(),
  image_url: z.string().url('Неверный формат ссылки').optional().or(z.literal('')),
});

type WishlistFormData = z.infer<typeof wishlistSchema>;

interface WishlistFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<WishlistItem, 'id' | 'created_at' | 'is_booked'>) => void;
  editingItem?: WishlistItem | null;
  currentUserId: string;
}

export function WishlistForm({
  isOpen,
  onClose,
  onSubmit,
  editingItem,
  currentUserId,
}: WishlistFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WishlistFormData>({
    resolver: zodResolver(wishlistSchema),
    defaultValues: {
      title: editingItem?.title || '',
      description: editingItem?.description || '',
      link: editingItem?.link || '',
      price: editingItem?.price || undefined,
      image_url: editingItem?.image_url || '',
    },
  });

  const handleFormSubmit = (data: WishlistFormData) => {
    onSubmit({
      user_id: currentUserId,
      title: data.title,
      description: data.description || null,
      link: data.link || null,
      price: data.price || null,
      image_url: data.image_url || null,
    });
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingItem ? 'Редактировать подарок' : 'Добавить подарок'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Название *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Наушники Sony WH-1000XM5"
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
              placeholder="Беспроводные наушники с шумоподавлением..."
              rows={2}
            />
          </div>

          {/* Link */}
          <div className="space-y-2">
            <Label htmlFor="link">Ссылка на товар</Label>
            <Input
              id="link"
              {...register('link')}
              placeholder="https://market.yandex.ru/product/..."
              type="url"
            />
            {errors.link && (
              <p className="text-sm text-red-500">{errors.link.message}</p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Примерная цена (₽)</Label>
            <Input
              id="price"
              type="number"
              {...register('price', { valueAsNumber: true })}
              placeholder="35000"
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="image_url">Ссылка на изображение</Label>
            <Input
              id="image_url"
              {...register('image_url')}
              placeholder="https://example.com/gift.jpg"
              type="url"
            />
            {errors.image_url && (
              <p className="text-sm text-red-500">{errors.image_url.message}</p>
            )}
            <p className="text-xs text-gray-400">
              Оставьте пустым для автоматического изображения
            </p>
          </div>

          {/* Submit */}
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Отмена
            </Button>
            <Button type="submit" className="flex-1">
              {editingItem ? 'Сохранить' : 'Добавить'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
