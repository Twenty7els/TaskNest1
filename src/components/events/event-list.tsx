'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/demo-store';
import { EventCard } from './event-card';
import { EventForm } from './event-form';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function EventList() {
  const [showForm, setShowForm] = useState(false);
  const getUpcomingEvents = useAppStore((state) => state.getUpcomingEvents);
  const events = getUpcomingEvents();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-purple-500" />
            <span className="font-medium text-gray-900">Предстоящие мероприятия</span>
          </div>
          <span className="text-sm text-gray-500">{events.length} событий</span>
        </div>
      </div>

      {/* Event Cards */}
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        <AnimatePresence mode="popLayout">
          {events.length > 0 ? (
            <div className="space-y-4 py-4">
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-64 text-gray-400"
            >
              <CalendarIcon className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg font-medium">Нет предстоящих мероприятий</p>
              <p className="text-sm">Создайте новое событие</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4 z-40">
        <Button
          onClick={() => setShowForm(true)}
          size="icon"
          className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg"
        >
          <Plus className="w-6 h-6 text-white" />
        </Button>
      </div>

      {/* Event Form Modal */}
      <EventForm open={showForm} onClose={() => setShowForm(false)} />
    </div>
  );
}
