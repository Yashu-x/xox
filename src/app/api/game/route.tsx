import { NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Game, { IGame } from '@/models/Game';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return NextResponse.json('Missing ID parameter', { status: 400 });
  }

  try {
    await connectMongoDB();

    const game: IGame | null = await Game.findOne({ roomId: id });

    if (game) {
      return NextResponse.json({ game }, { status: 200 });
    } else {
      return NextResponse.json("game not found", { status: 400 });
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return NextResponse.json('Internal server error', { status: 500 });
  }
}
