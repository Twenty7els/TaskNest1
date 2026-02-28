'use client';

import { useAppStore } from '@/lib/demo-store';
import { TaskCard } from './task-card';
import { TaskProgress } from './task-progress';
import { TaskForm } from './task-form';
import { TaskArchive } from './task-archive';
import { Button } from '@/components/ui/button';
import { Plus, Archive, ShoppingBag, Home, MoreHorizontal, Filter } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function TaskList() {
  const [showForm, setShowForm] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [filter, setFilter] = useState<'all' | 'shopping' | 'home' | 'other'>('all');

  const getActiveTasks = useAppStore((state) => state.getActiveTasks);
  const activeTasks = getActiveTasks();

  const filteredTasks = activeTasks.filter((task) => {
    if (filter === 'all') return true;
    return task.type === filter;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Progress */}
      <TaskProgress />

      {/* Filter Tabs */}
      <div className="px-4 py-2">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList className="w-full grid grid-cols-4 h-10">
            <TabsTrigger value="all" className="text-xs">Все</TabsTrigger>
            <TabsTrigger value="shopping" className="text-xs flex items-center gap-1">
              <ShoppingBag className="w-3 h-3" />
              Покупки
            </TabsTrigger>
            <TabsTrigger value="home" className="text-xs flex items-center gap-1">
              <Home className="w-3 h-3" />
              Дом
            </TabsTrigger>
            <TabsTrigger value="other" className="text-xs flex items-center gap-1">
              <MoreHorizontal className="w-3 h-3" />
              Другое
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Task Cards */}
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length > 0 ? (
            <div className="space-y-4 py-2">
              {filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <TaskCard task={task} />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-64 text-gray-400"
            >
              <ShoppingBag className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg font-medium">Нет активных задач</p>
              <p className="text-sm">Добавьте новую задачу</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-20 right-4 flex flex-col gap-2 z-40">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowArchive(true)}
          className="w-12 h-12 rounded-full bg-white shadow-lg border-gray-200 hover:bg-gray-50"
        >
          <Archive className="w-5 h-5 text-gray-600" />
        </Button>
        <Button
          onClick={() => setShowForm(true)}
          size="icon"
          className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg"
        >
          <Plus className="w-6 h-6 text-white" />
        </Button>
      </div>

      {/* Task Form Modal */}
      <TaskForm open={showForm} onClose={() => setShowForm(false)} />

      {/* Archive Modal */}
      <TaskArchive open={showArchive} onClose={() => setShowArchive(false)} />
    </div>
  );
}
