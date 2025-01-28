import { NextResponse } from "next/server";
import { z } from "zod";
import { connectMongoDB } from "@/lib/mongodb";
import challage from "@/models/challage";
import Users from "@/models/users";

// Define a schema for incoming data
const requestSchema = z.object({
  player1id: z.string().nonempty("Player 1 ID is required"),
  player2email: z.string().email("Invalid email address"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { player1id, player2email } = requestSchema.parse(body);

    // Connect to MongoDB
    await connectMongoDB();

    // Check if Player 2 exists
    const player2 = await Users.findOne({
      email: { $regex: new RegExp(`^${player2email}$`, "i") },
    }).select("_id");

    if (!player2) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    const player2id = player2._id;

    // Check for duplicate challenges
    const existingChallenge = await challage.findOne({ player1id, player2id });
    if (existingChallenge) {
      return NextResponse.json(
        { error: "Challenge already sent" },
        { status: 400 }
      );
    }

    // Save the new challenge
    const newChallenge = new challage({ player1id, player2id });
    await newChallenge.save();

    return NextResponse.json({ message: "Challenge sent" }, { status: 200 });
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
