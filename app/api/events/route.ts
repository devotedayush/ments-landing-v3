import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/utils';

export async function GET() {
  const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await supabase.from('events').insert([body]).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data[0]);
} 