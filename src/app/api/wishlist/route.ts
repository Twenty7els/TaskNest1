import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

// GET /api/wishlist - Get wishlist items
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    let query = supabase
      .from('wishlist_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Hide booked_by from wishlist owners (anonymity)
    const currentUserId = searchParams.get('current_user_id');
    const anonymizedData = data?.map((item) => ({
      ...item,
      // Only show booked_by to the person who booked
      booked_by: item.booked_by === currentUserId ? item.booked_by : undefined,
    }));

    return NextResponse.json({ data: anonymizedData });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/wishlist - Create wishlist item
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from('wishlist_items')
      .insert({
        user_id: body.user_id,
        title: body.title,
        description: body.description || null,
        link: body.link || null,
        price: body.price || null,
        is_booked: false,
      })
      .select()
      .single();

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

// PATCH /api/wishlist - Book/Cancel booking
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await request.json();

    if (body.action === 'book') {
      const { error } = await supabase
        .from('wishlist_items')
        .update({
          is_booked: true,
          booked_by: body.booked_by,
          booked_at: new Date().toISOString(),
        })
        .eq('id', body.item_id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // Create booking record
      await supabase.from('wishlist_bookings').insert({
        item_id: body.item_id,
        user_id: body.booked_by,
      });

      return NextResponse.json({ success: true });
    }

    if (body.action === 'cancel') {
      const { error } = await supabase
        .from('wishlist_items')
        .update({
          is_booked: false,
          booked_by: null,
          booked_at: null,
        })
        .eq('id', body.item_id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/wishlist
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const { error } = await supabase.from('wishlist_items').delete().eq('id', id);

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
