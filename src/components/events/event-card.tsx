'use client';

import { motion } from 'framer-motion';
import { MapPin, Check, X, Clock } from 'lucide-react';
import { Event, EventResponse } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface EventCardProps {
  event: Event;
  currentUserId: string;
  onResponse: (eventId: string, response: EventResponse) => void;
  onDelete: (eventId: string) => void;
}

// Event images based on keywords
const eventImages: Record<string, string> = {
  default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=600&fit=crop',
  birthday: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=600&fit=crop',
  cinema: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop',
  picnic: 'https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=400&h=600&fit=crop',
  concert: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=600&fit=crop',
  meeting: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=600&fit=crop',
  party: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&h=600&fit=crop',
};

const getEventImage = (title: string): string => {
  const lower = title.toLowerCase();
  if (lower.includes('день рождения') || lower.includes('birthday')) return eventImages.birthday;
  if (lower.includes('кино') || lower.includes('cinema')) return eventImages.cinema;
  if (lower.includes('пикник') || lower.includes('picnic')) return eventImages.picnic;
  if (lower.includes('концерт') || lower.includes('concert')) return eventImages.concert;
  if (lower.includes('встреча') || lower.includes('meeting')) return eventImages.meeting;
  if (lower.includes('праздник') || lower.includes('party')) return eventImages.party;
  return eventImages.default;
};

export function EventCard({
  event,
  currentUserId,
  onResponse,
  onDelete,
}: EventCardProps) {
  const isCreator = event.created_by === currentUserId;
  const participant = event.participants?.find((p) => p.user_id === currentUserId);
  const isGoing = participant?.response === 'going';
  const isNotGoing = participant?.response === 'not_going';

  const eventDate = new Date(event.event_date);
  const formattedDate = format(eventDate, 'd MMMM', { locale: ru });
  const formattedTime = format(eventDate, 'HH:mm');
  const formattedDay = format(eventDate, 'EEE', { locale: ru });
  const isPast = eventDate < new Date();

  // Count responses
  const goingCount = event.participants?.filter((p) => p.response === 'going').length || 0;

  // Get background image - use custom image or fallback to keyword-based
  const bgImage = event.image_url || getEventImage(event.title);

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
          alt={event.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Gradient Overlay */}
        <div className={cn(
          'absolute inset-0',
          isPast 
            ? 'bg-gradient-to-t from-gray-900/95 via-gray-800/70 to-gray-700/40'
            : 'bg-gradient-to-t from-black/80 via-black/40 to-black/20'
        )} />
      </div>

      {/* Content Overlay */}
      <div className="relative h-full flex flex-col justify-between p-5">
        {/* Top Row - Date Badge */}
        <div className="flex items-start justify-between">
          {/* Date Badge */}
          <div className="bg-white/15 backdrop-blur-md rounded-2xl px-4 py-3 text-center border border-white/20">
            <p className="text-white/70 text-xs uppercase">{formattedDay}</p>
            <p className="text-3xl font-bold text-white">{formattedDate.split(' ')[0]}</p>
            <p className="text-white/70 text-xs capitalize">{formattedDate.split(' ')[1]}</p>
          </div>

          {/* Creator Badge or Delete */}
          {isCreator && !isPast ? (
            <button
              onClick={() => onDelete(event.id)}
              className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-red-500/80 backdrop-blur-sm rounded-full transition-colors border border-white/20"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          ) : isCreator ? (
            <span className="px-3 py-1.5 bg-white/15 backdrop-blur-md rounded-full text-white text-xs font-medium border border-white/20">
              Организатор
            </span>
          ) : null}
        </div>

        {/* Bottom Section */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            <h3 className={cn(
              'text-2xl font-bold text-white leading-tight',
              isPast && 'opacity-50'
            )}>
              {event.title}
            </h3>
            
            {/* Description */}
            {event.description && (
              <p className="text-white/50 text-sm mt-1.5 line-clamp-2">
                {event.description}
              </p>
            )}
          </div>

          {/* Time & Location */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white/80">
              <Clock className="w-4 h-4" />
              <span className="text-lg font-medium">{formattedTime}</span>
            </div>
            
            {event.location && (
              <div className="flex items-start gap-2 text-white/60">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="text-sm line-clamp-2">{event.location}</span>
              </div>
            )}
          </div>

          {/* Participants */}
          {event.participants && event.participants.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {event.participants.slice(0, 5).map((p) => {
                  const user = p.user;
                  if (!user) return null;
                  return (
                    <div key={p.id} className="relative">
                      <Avatar className="w-8 h-8 border-2 border-white/30 shadow-lg">
                        <AvatarImage src={user.avatar_url || ''} />
                        <AvatarFallback className="text-xs bg-white/20 text-white font-semibold">
                          {user.first_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      {p.response === 'going' && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white/30 flex items-center justify-center">
                          <Check className="w-2 h-2 text-white" />
                        </div>
                      )}
                      {p.response === 'not_going' && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white/30 flex items-center justify-center">
                          <X className="w-2 h-2 text-white" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <span className="text-white/50 text-xs">
                {goingCount} идут
              </span>
            </div>
          )}

          {/* Response Buttons */}
          {!isCreator && !isPast && participant && (
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onResponse(event.id, 'going')}
                className={cn(
                  'flex-1 py-2.5 rounded-full font-semibold text-sm transition-colors',
                  isGoing
                    ? 'bg-green-500 text-white'
                    : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'
                )}
              >
                Пойду
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onResponse(event.id, 'not_going')}
                className={cn(
                  'flex-1 py-2.5 rounded-full font-semibold text-sm transition-colors',
                  isNotGoing
                    ? 'bg-red-500 text-white'
                    : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'
                )}
              >
                Не пойду
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
