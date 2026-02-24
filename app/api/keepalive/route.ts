import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export const dynamic = 'force-dynamic'; // Prevent Next.js from caching this route

export async function GET(request: Request) {
  try {
    // Supabase'e basit bir sorgu atarak veritabanını uyanık tutuyoruz
    const { data, error } = await supabase
      .from('site_content')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Supabase keep-alive hatası:', error.message);
      return NextResponse.json({ 
        status: 'error', 
        message: 'Supabase ping başarısız oldu: ' + error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      status: 'ok', 
      message: 'Vercel ve Supabase uyanık tutuldu!',
      time: new Date().toISOString() 
    }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ 
      status: 'error', 
      message: 'Beklenmeyen hata: ' + err.message 
    }, { status: 500 });
  }
}
