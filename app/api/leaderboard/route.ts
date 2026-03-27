import { NextRequest, NextResponse } from 'next/server';

// In-memory fallback (resets on cold starts — swap for Vercel KV in production)
const inMemoryBoard: { name: string; score: number; difficulty: string; date: string }[] = [];

export async function GET() {
  try {
    // Try Vercel KV if available
    // const { kv } = await import('@vercel/kv');
    // const entries = await kv.zrevrange('leaderboard', 0, 9, { withScores: true });
    // ... parse and return

    const sorted = [...inMemoryBoard].sort((a, b) => b.score - a.score).slice(0, 10);
    return NextResponse.json(sorted);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, score, difficulty, date } = body;

    if (typeof score !== 'number' || score < 0 || score > 15000) {
      return NextResponse.json({ error: 'Invalid score' }, { status: 400 });
    }

    const sanitizedName = String(name || 'anonymous').slice(0, 20).replace(/[<>"]/g, '');

    inMemoryBoard.push({ name: sanitizedName, score, difficulty, date });
    // Keep only top 100
    inMemoryBoard.sort((a, b) => b.score - a.score);
    if (inMemoryBoard.length > 100) inMemoryBoard.splice(100);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
