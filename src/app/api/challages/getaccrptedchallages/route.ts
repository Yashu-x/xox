import { NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Game from '@/models/Game';
import Users from '@/models/users';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing ID parameter' }, { status: 400 });
  }

  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Find all games where the user ID is in the players array
    const rooms = await Game.find({ players: id });

    if (rooms.length > 0) {
      // Get challenge details with player data
      const challengeDetails = await Promise.all(
        rooms.map(async (room) => {
          // Fetch player details for each player in the room
          const playerDetails = await Promise.all(
            room.players.map(async (playerId) => {
              const player = await Users.findById(playerId);
              return player ? { id: player._id, name: player.name, email: player.email } : null;
            })
          );

          return {
            gameId: room._id,
            roomId: room.roomId,
            players: playerDetails.filter((player) => player !== null), // Exclude any null player details
            moves: room.moves,
            winner: room.winner,
            createdAt: room.createdAt,
          };
        })
      );

      return NextResponse.json({ rooms: challengeDetails }, { status: 200 });
    } else {
      return NextResponse.json({ rooms: [] }, { status: 200 });
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
