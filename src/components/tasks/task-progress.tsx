'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Circle } from 'lucide-react';
import { Task } from '@/types';

interface TaskProgressProps {
  tasks: Task[];
}

export function TaskProgress({ tasks }: TaskProgressProps) {
  const activeTasks = tasks.filter((t) => t.status === 'active');
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const totalTasks = activeTasks.length + completedTasks.length;
  const progress = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;

  if (totalTasks === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-50 rounded-2xl p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Прогресс</span>
        </div>
        <div className="flex items-center gap-1 text-sm font-semibold">
          <span className="text-green-500">{completedTasks.length}</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-500">{totalTasks}</span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
        />
      </div>
      
      {/* Status */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Circle className="w-3 h-3 fill-gray-200 text-gray-200" />
          <span>{activeTasks.length} осталось</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-green-600">
          <CheckCircle className="w-3 h-3 fill-green-100" />
          <span>{completedTasks.length} выполнено</span>
        </div>
      </div>
    </motion.div>
  );
}
