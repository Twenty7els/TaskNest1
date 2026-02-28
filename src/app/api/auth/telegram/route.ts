import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

// Telegram user data from Mini App
interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

export async function POST(request: NextRequest) {
  try {
    const user: TelegramUser = await request.json();
    
    if (!user.id || !user.first_name) {
      return NextResponse.json(
        { error: 'Invalid user data' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', user.id)
      .single();

    if (existingUser) {
      // Update existing user
      const { data, error } = await supabase
        .from('users')
        .update({
          first_name: user.first_name,
          last_name: user.last_name || null,
          username: user.username || null,
          avatar_url: user.photo_url || existingUser.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingUser.id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ user: data, isNew: false });
    }

    // Create new user
    const { data, error } = await supabase
      .from('users')
      .insert({
        telegram_id: user.id,
        first_name: user.first_name,
        last_name: user.last_name || null,
        username: user.username || null,
        avatar_url: user.photo_url || null,
        show_birthday: true,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ user: data, isNew: true });

  } catch (error) {
    console.error('Telegram auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
