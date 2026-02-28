'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Clock } from 'lucide-react';
import { Task } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { categoryColors, defaultCategoryColor, getUserById } from '@/lib/demo-data';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface TaskArchiveProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
}

export function TaskArchive({ isOpen, onClose, tasks }: TaskArchiveProps) {
  const archivedTasks = tasks.filter((t) => t.status === 'archived');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Архив задач
          </DialogTitle>
        </DialogHeader>

        {archivedTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>Архив пуст</p>
            <p className="text-sm mt-1">Выполненные задачи появятся здесь</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {archivedTasks.map((task, index) => {
                const category = task.category;
                const colors = category
                  ? categoryColors[category.id] || defaultCategoryColor
                  : defaultCategoryColor;
                const completedBy = task.completed_by
                  ? getUserById(task.completed_by)
                  : null;
                const completedTime = task.completed_at
                  ? formatDistanceToNow(new Date(task.completed_at), {
                      addSuffix: true,
                      locale: ru,
                    })
                  : '';

                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gray-50 rounded-xl p-3 border border-gray-100"
                  >
                    <div className="flex items-start gap-3">
                      {/* Status Icon */}
                      <div
                        className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br text-white',
                          colors.gradient
                        )}
                      >
                        <Check className="w-4 h-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-gray-700 line-through">
                              {task.title}
                            </p>
                            {category && (
                              <Badge
                                variant="outline"
                                className="mt-1 text-xs bg-white"
                              >
                                {category.name}
                              </Badge>
                            )}
                          </div>
                          {task.quantity && (
                            <span className="text-sm text-gray-400">
                              {task.quantity} {task.unit}
                            </span>
                          )}
                        </div>

                        {/* Meta */}
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                          {completedBy && (
                            <span>Выполнил(а): {completedBy.first_name}</span>
                          )}
                          <span>•</span>
                          <span>{completedTime}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
