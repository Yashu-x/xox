import { NextResponse } from "next/server";
import { z } from "zod";
import { connectMongoDB } from "@/lib/mongodb";
import challage from "@/models/challage";
import Game from "@/models/Game";

// Define a schema for incoming data
const requestSchema = z.object({
  challengeId: z.string().nonempty("challenge Id is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { challengeId } = requestSchema.parse(body);

    // Connect to MongoDB
    await connectMongoDB();

    // Find the challenge
    const existingChallenge = await challage.findById(challengeId);
    if (!existingChallenge) {
      return NextResponse.json(
        { error: "Challenge not found" },
        { status: 404 }
      );
    }

    const { player1id, player2id } = existingChallenge;

    // Create a room with both players
    const roomId = `room-${Date.now()}`; // Generate a unique room ID
    const newGame = new Game({
      roomId,
      players: [player1id, player2id],
      moves: [],
      winner: null,
    });

    // Save the game to the database
    await newGame.save();

    // Optionally delete the challenge after accepting
    await challage.findByIdAndDelete(challengeId);

    return NextResponse.json(
      {
        message: "Challenge successfully accepted",
        roomId,
        players: [player1id, player2id],
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid input data",
          details: error.errors.map((err) => ({
            path: err.path,
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error("Unexpected server error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
