'use client';

import { motion } from 'framer-motion';
import { Check, Trash2, Archive, Plus } from 'lucide-react';
import { Task, User as UserType } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onComplete: () => void;
  onArchive: () => void;
  onDelete: () => void;
  users: UserType[];
}

// Category images mapping (Unsplash)
const categoryImages: Record<string, string> = {
  // Shopping
  'c1': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=600&fit=crop', // Молочное
  'c2': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=600&fit=crop', // Мясо
  'c3': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=600&fit=crop', // Бакалея
  'c4': 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=600&fit=crop', // Овощи/Фрукты
  'c5': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=600&fit=crop', // Напитки
  'c6': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=600&fit=crop', // Хлеб
  'c7': 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=600&fit=crop', // Маркетплейсы
  'c8': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=600&fit=crop', // Аптека
  'c9': 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=400&h=600&fit=crop', // Бытовая химия
  'c10': 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=600&fit=crop', // Другое (shopping)
  // Home
  'c11': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=600&fit=crop', // Уборка
  'c12': 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=600&fit=crop', // Ремонт
  'c13': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=600&fit=crop', // Сад
  'c14': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=600&fit=crop', // Готовка
  'c15': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=600&fit=crop', // Другое (home)
  // Other
  'c16': 'https://images.unsplash.com/photo-1568219656418-15c329312bf1?w=400&h=600&fit=crop', // Документы
  'c17': 'https://images.unsplash.com/photo-1523966211575-eb4a01e7dd51?w=400&h=600&fit=crop', // Звонки
  'c18': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=600&fit=crop', // Встречи
  'c19': 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=600&fit=crop', // Другое (other)
};

const defaultImage = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=600&fit=crop';

export function TaskCard({ task, onComplete, onArchive, onDelete, users }: TaskCardProps) {
  const isCompleted = task.status === 'completed';
  const isArchived = task.status === 'archived';
  
  // Get background image
  const bgImage = task.category_id 
    ? categoryImages[task.category_id] || defaultImage 
    : defaultImage;

  // Get assigned users
  const assignedUsers = users.filter((u) => task.assigned_to.includes(u.id));
  const maxVisible = 3;
  const extraCount = assignedUsers.length - maxVisible;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: -20 },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/5] w-full"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt={task.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Gradient Overlay */}
        <div className={cn(
          'absolute inset-0',
          isCompleted 
            ? 'bg-gradient-to-t from-gray-900/95 via-gray-800/70 to-gray-700/40'
            : 'bg-gradient-to-t from-black/80 via-black/40 to-black/20'
        )} />
      </div>

      {/* Content Overlay */}
      <div className="relative h-full flex flex-col justify-between p-5">
        {/* Top Row - Category & Actions */}
        <div className="flex items-start justify-between">
          {/* Category Badge */}
          {task.category && (
            <span className="px-3 py-1.5 bg-white/15 backdrop-blur-md rounded-full text-white text-xs font-medium border border-white/20">
              {task.category.name}
            </span>
          )}

          {/* Delete Button (only for active) */}
          {!isCompleted && !isArchived && (
            <button
              onClick={onDelete}
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
              isCompleted && 'line-through opacity-40'
            )}>
              {task.title}
            </h3>
            
            {/* Description */}
            {task.description && (
              <p className="text-white/50 text-sm mt-1.5 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>

          {/* Quantity & Unit */}
          {task.quantity !== null && task.quantity !== undefined && (
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-white">
                {task.quantity}
              </span>
              <span className="text-lg text-white/60 font-medium">
                {task.unit}
              </span>
            </div>
          )}

          {/* Bottom Row - Assigned Users & Action Button */}
          <div className="flex items-center justify-between">
            {/* Assigned Users */}
            {assignedUsers.length > 0 ? (
              <div className="flex items-center gap-1.5">
                <div className="flex -space-x-2">
                  {assignedUsers.slice(0, maxVisible).map((user) => (
                    <Avatar key={user.id} className="w-8 h-8 border-2 border-white/30 shadow-lg">
                      <AvatarImage src={user.avatar_url || ''} />
                      <AvatarFallback className="text-xs bg-white/20 text-white font-semibold">
                        {user.first_name[0]}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {extraCount > 0 && (
                    <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-xs text-white font-semibold">
                      +{extraCount}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <span className="text-white/30 text-sm">Общая задача</span>
            )}

            {/* Action Button */}
            {!isCompleted && !isArchived && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onComplete}
                className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-100 rounded-full text-gray-900 font-semibold shadow-lg transition-colors"
              >
                {task.type === 'shopping' ? (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>Добавить</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Готово</span>
                  </>
                )}
              </motion.button>
            )}

            {isCompleted && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onArchive}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white font-semibold border border-white/30 transition-colors"
              >
                <Archive className="w-5 h-5" />
                <span>В архив</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
