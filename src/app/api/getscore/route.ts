import { NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Scores, { IScores } from '@/models/scores';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return NextResponse.json('Missing ID parameter', { status: 400 });
  }

  try {
    await connectMongoDB();

    let score: IScores | null = await Scores.findOne({ id });

    if (score) {
      return NextResponse.json({ points: score.points }, { status: 200 });
    } else {
      score = new Scores({ id, points: 0 });
      await score.save();
      return NextResponse.json({ points: score.points }, { status: 200 });
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return NextResponse.json('Internal server error', { status: 500 });
  }
}
