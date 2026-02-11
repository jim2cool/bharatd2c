import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function makeSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function POST(req: Request) {
  try {
    const { title, cogs, store_id } = await req.json();

    if (!title || !cogs || !store_id) {
      return NextResponse.json(
        { error: 'Missing title, cogs, or store_id' },
        { status: 400 }
      );
    }

    const slug = makeSlug(title);

    const { data, error } = await supabase
      .from('products')
      .insert({
        title,
        slug,
        cogs,
        status: 'draft',
        store_id,
      })
      .select('id')
      .single();

    if (error) {
      console.error('PRODUCT CREATE ERROR:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: data.id });
  } catch (err) {
    console.error('CREATE PRODUCT API CRASH:', err);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
