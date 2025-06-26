import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/utils';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await req.json();
  const { data, error } = await supabase.from('events').update(body).eq('id', id).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data[0]);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
} 