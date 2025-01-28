import { NextResponse } from "next/server";
import { z } from "zod";
import { connectMongoDB } from "@/lib/mongodb";
import challage from "@/models/challage";

// Define a schema for incoming data
const requestSchema = z.object({
  challageId: z.string().nonempty("challengeId is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { challageId } = requestSchema.parse(body);

    // Connect to MongoDB
    await connectMongoDB();
    // Find the challenge
    const existingChallenge = await challage.findById(challageId);
    if (!existingChallenge) {
      return NextResponse.json(
        { error: "Challenge not found" },
        { status: 404 }
      );
    }

    await challage.findByIdAndDelete(challageId);

    return NextResponse.json({ message: "Challenge declind Succssesfully" }, { status: 200 });
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
