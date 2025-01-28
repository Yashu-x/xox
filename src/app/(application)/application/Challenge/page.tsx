import ChallageBubble from "@/components/ChallageBubble";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import axios from "axios";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const userId = session.user?.id;

  try {
    // Fetch the challenges from the API using axios
    const response = await axios.get(
      "http://localhost:3000/api/challages/getchallages",
      {
        params: { id: userId },
      }
    );

    const { challenges } = response.data;

    return (
      <div>
        <h6>Challenges</h6>
        {challenges.map(
          (challenge: { playerName: string; challengeId: string }) => (
            <ChallageBubble
              key={challenge.challengeId}
              playerName={challenge.playerName}
              challageid={challenge.challengeId}
            />
          )
        )}
        <Link href="Challenge/AddChallage">
          <Button>Add Challages</Button>
        </Link>
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch challenges:", error);
    notFound(); // Handle errors gracefully
  }
};

export default Page;
