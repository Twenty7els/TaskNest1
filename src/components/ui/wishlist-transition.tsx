'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

interface WishlistTransitionProps {
  isVisible: boolean;
}

// Star streak that flies from center outward in BOTH directions
function StarStreak({ index, totalStreaks }: { index: number; totalStreaks: number }) {
  // Distribute streaks evenly around the circle
  const baseAngle = (index / totalStreaks) * 360;
  const angle = baseAngle + (Math.random() - 0.5) * 8;
  
  // Random properties for variety
  const length = 40 + Math.random() * 80;
  const delay = Math.random() * 0.3;
  const duration = 1 + Math.random() * 0.3;
  
  return (
    <div
      className="absolute"
      style={{
        left: '50%',
        top: '50%',
        width: '0',
        height: '0',
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          transformOrigin: '50% 50%',
          transform: `rotate(${angle}deg)`,
        }}
        initial={{ 
          scaleX: 0,
          opacity: 0,
        }}
        animate={{ 
          scaleX: [0, 0.3, 3],
          opacity: [0, 0.9, 0.7, 0],
        }}
        transition={{ 
          duration,
          delay,
          ease: [0.25, 0.1, 0.25, 1],
          times: [0, 0.1, 0.7, 1],
        }}
      >
        {/* Double-sided streak - gradient goes both ways from center */}
        <div
          style={{
            position: 'absolute',
            left: `-${length}px`,
            top: '-1px',
            width: `${length * 2}px`,
            height: '2px',
            background: 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)',
            boxShadow: '0 0 6px 1px rgba(255,255,255,0.7)',
            borderRadius: '2px',
          }}
        />
      </motion.div>
    </div>
  );
}

// Small point star for additional depth
function PointStar({ index }: { index: number }) {
  const angle = (index / 20) * 360 + Math.random() * 20;
  const delay = Math.random() * 0.4;
  
  return (
    <div
      className="absolute"
      style={{
        left: '50%',
        top: '50%',
        width: '0',
        height: '0',
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          transformOrigin: '50% 50%',
          transform: `rotate(${angle}deg) translateX(20px)`,
        }}
        initial={{ 
          scale: 0,
          opacity: 0,
        }}
        animate={{ 
          scale: [0, 1, 5],
          opacity: [0, 1, 0],
          x: [0, 0, 300],
        }}
        transition={{ 
          duration: 1.2,
          delay,
          ease: 'easeOut',
        }}
      >
        <div
          style={{
            width: '3px',
            height: '3px',
            backgroundColor: 'white',
            borderRadius: '50%',
            boxShadow: '0 0 8px 2px rgba(255,255,255,0.9)',
            marginLeft: '-1.5px',
            marginTop: '-1.5px',
          }}
        />
      </motion.div>
    </div>
  );
}

export function WishlistTransition({ isVisible }: WishlistTransitionProps) {
  const streakCount = 50;
  const pointStarCount = 20;
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden pointer-events-none bg-black"
        >
          {/* Star streaks - warp speed effect, going both directions */}
          {[...Array(streakCount)].map((_, i) => (
            <StarStreak key={`streak-${i}`} index={i} totalStreaks={streakCount} />
          ))}

          {/* Additional point stars for depth */}
          {[...Array(pointStarCount)].map((_, i) => (
            <PointStar key={`point-${i}`} index={i} />
          ))}

          {/* Center heart */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.2, 1],
              opacity: 1,
            }}
            exit={{ 
              scale: 1.8, 
              opacity: 0 
            }}
            transition={{ 
              duration: 0.4,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            className="relative z-10 flex items-center justify-center"
          >
            {/* Soft glow behind heart */}
            <motion.div
              animate={{ 
                scale: [1, 1.4, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ 
                duration: 0.6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute w-32 h-32 bg-white/30 rounded-full blur-3xl"
            />

            {/* Pulse rings */}
            <motion.div
              animate={{ 
                scale: [0.5, 2.5],
                opacity: [0.5, 0],
              }}
              transition={{ 
                duration: 0.8,
                repeat: Infinity,
                ease: 'easeOut',
              }}
              className="absolute w-16 h-16 rounded-full border border-white/40"
            />

            <motion.div
              animate={{ 
                scale: [0.3, 2],
                opacity: [0.3, 0],
              }}
              transition={{ 
                duration: 0.8,
                repeat: Infinity,
                ease: 'easeOut',
                delay: 0.4,
              }}
              className="absolute w-12 h-12 rounded-full border border-white/30"
            />

            {/* Heart */}
            <motion.div
              animate={{ 
                scale: [1, 1.08, 1],
              }}
              transition={{ 
                duration: 0.4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Heart 
                className="w-20 h-20 text-white fill-white drop-shadow-[0_0_30px_rgba(255,255,255,0.8)]"
                strokeWidth={0}
              />
            </motion.div>
          </motion.div>

          {/* Radial gradient overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.6)_60%,rgba(0,0,0,0.9)_100%)]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
