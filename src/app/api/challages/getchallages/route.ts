import { NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import challage, { IChallage } from '@/models/challage';
import Users from '@/models/users';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing ID parameter' }, { status: 400 });
  }

  try {
    await connectMongoDB();

    // Find challenges where player2id matches the provided ID
    const challenges: IChallage[] | null = await challage.find({ player2id: id });

    if (challenges && challenges.length > 0) {
      const challengeDetails = await Promise.all(
        challenges.map(async (challenge) => {
          const challenger = await Users.findOne({ _id: challenge.player1id });
          return {
            playerName: challenger?.name || 'Unknown',
            challengeId: challenge._id,
          };
        })
      );

      return NextResponse.json({ challenges: challengeDetails }, { status: 200 });
    } else {
      return NextResponse.json({ challenges: [] }, { status: 200 });
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
