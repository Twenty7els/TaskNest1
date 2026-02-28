'use client';

import { motion } from 'framer-motion';
import { Gift, ExternalLink, Lock, Trash2 } from 'lucide-react';
import { WishlistItem } from '@/types';
import { cn } from '@/lib/utils';

interface WishlistCardProps {
  item: WishlistItem;
  isOwner: boolean;
  currentUserId: string;
  onBook: (itemId: string) => void;
  onCancelBooking: (itemId: string) => void;
  onDelete: (itemId: string) => void;
}

// Gift images based on keywords
const giftImages: Record<string, string> = {
  default: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=600&fit=crop',
  наушники: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=600&fit=crop',
  книга: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
  сертификат: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=600&fit=crop',
  одежда: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=600&fit=crop',
  электроника: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=600&fit=crop',
  техника: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=600&fit=crop',
  украшения: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=600&fit=crop',
  игра: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=600&fit=crop',
  спорт: 'https://images.unsplash.com/photo-1461896836934- voices?w=400&h=600&fit=crop',
};

const getGiftImage = (title: string): string => {
  const lower = title.toLowerCase();
  for (const [key, url] of Object.entries(giftImages)) {
    if (lower.includes(key)) return url;
  }
  return giftImages.default;
};

export function WishlistCard({
  item,
  isOwner,
  currentUserId,
  onBook,
  onCancelBooking,
  onDelete,
}: WishlistCardProps) {
  const isBookedByMe = item.booked_by === currentUserId;
  const isBookedByOther = item.is_booked && !isBookedByMe;

  // Get background image - use custom image or fallback to keyword-based
  const bgImage = item.image_url || getGiftImage(item.title);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      layout
      className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/5] w-full"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt={item.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Gradient Overlay */}
        <div className={cn(
          'absolute inset-0',
          item.is_booked 
            ? 'bg-gradient-to-t from-gray-900/95 via-gray-800/70 to-gray-700/40'
            : 'bg-gradient-to-t from-black/80 via-black/40 to-black/20'
        )} />
      </div>

      {/* Content Overlay */}
      <div className="relative h-full flex flex-col justify-between p-5">
        {/* Top Row */}
        <div className="flex items-start justify-between">
          {/* Price Badge */}
          {item.price && (
            <div className="bg-white/15 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
              <span className="text-xl font-bold text-white">
                {item.price.toLocaleString('ru-RU')} ₽
              </span>
            </div>
          )}

          {/* Status or Delete */}
          {!isOwner && item.is_booked && (
            <div className="bg-green-500/80 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-white" />
              <span className="text-white text-xs font-medium">
                {isBookedByMe ? 'Вы забронировали' : 'Забронировано'}
              </span>
            </div>
          )}
          
          {isOwner && !item.is_booked && (
            <button
              onClick={() => onDelete(item.id)}
              className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-red-500/80 backdrop-blur-sm rounded-full transition-colors border border-white/20"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
          )}
        </div>

        {/* Bottom Section */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            <h3 className={cn(
              'text-2xl font-bold text-white leading-tight',
              item.is_booked && 'line-through opacity-40'
            )}>
              {item.title}
            </h3>
            
            {/* Description */}
            {item.description && (
              <p className="text-white/50 text-sm mt-1.5 line-clamp-2">
                {item.description}
              </p>
            )}
          </div>

          {/* Link */}
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Ссылка на товар
            </a>
          )}

          {/* Action Buttons */}
          {!isOwner && !item.is_booked && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onBook(item.id)}
              className="w-full py-3 bg-white hover:bg-gray-100 rounded-full text-gray-900 font-semibold shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              <Gift className="w-5 h-5" />
              Забронировать
            </motion.button>
          )}

          {!isOwner && isBookedByMe && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onCancelBooking(item.id)}
              className="w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white font-semibold border border-white/30 transition-colors flex items-center justify-center gap-2"
            >
              <Lock className="w-5 h-5" />
              Отменить бронь
            </motion.button>
          )}

          {isOwner && item.is_booked && (
            <div className="flex items-center gap-2 text-white/50">
              <Lock className="w-4 h-4" />
              <span className="text-sm">Кто-то забронировал</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
