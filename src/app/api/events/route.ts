import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

// GET /api/events - Get events
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    let query = supabase
      .from('events')
      .select(`
        *,
        creator:users!events_created_by_fkey(*),
        participants:event_participants(
          *,
          user:users(*)
        )
      `)
      .order('event_date', { ascending: true });

    if (userId) {
      // Get events where user is creator or invited
      query = query.or(`created_by.eq.${userId},invited_users.cs.{${userId}}`);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/events - Create event
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await request.json();

    // Create event
    const { data: event, error: eventError } = await supabase
      .from('events')
      .insert({
        created_by: body.created_by,
        title: body.title,
        description: body.description || null,
        location: body.location || null,
        event_date: body.event_date,
        invited_users: body.invited_users || [],
      })
      .select()
      .single();

    if (eventError) {
      return NextResponse.json({ error: eventError.message }, { status: 500 });
    }

    // Create participants
    if (body.invited_users?.length > 0) {
      const participants = body.invited_users.map((userId: string) => ({
        event_id: event.id,
        user_id: userId,
        response: 'pending',
      }));

      await supabase.from('event_participants').insert(participants);
    }

    return NextResponse.json({ data: event });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/events - Update event participant response
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await request.json();

    if (body.type === 'response') {
      // Update participant response
      const { error } = await supabase
        .from('event_participants')
        .update({
          response: body.response,
          updated_at: new Date().toISOString(),
        })
        .eq('event_id', body.event_id)
        .eq('user_id', body.user_id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid update type' }, { status: 400 });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/events
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const { error } = await supabase.from('events').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
