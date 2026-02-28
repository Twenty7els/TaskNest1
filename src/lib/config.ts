// =====================================================
// App Configuration
// =====================================================

// Demo mode toggle - set to false when ready for production
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';

// Feature flags
export const config = {
  // Use demo data (Zustand store) or real Supabase
  useDemoData: DEMO_MODE,
  
  // Enable Telegram auth (requires real bot token)
  enableTelegramAuth: !DEMO_MODE,
  
  // Enable real-time subscriptions (requires Supabase)
  enableRealtime: !DEMO_MODE,
  
  // Enable notifications (requires Telegram bot)
  enableNotifications: !DEMO_MODE,
};

// Log current mode
if (typeof window !== 'undefined') {
  console.log(`🎯 Family App running in ${DEMO_MODE ? 'DEMO' : 'PRODUCTION'} mode`);
}
