import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import axios from "axios";

const page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const userId = session?.user?.id;

  try {
    // Fetch the points from the API using axios
    const response = await axios.get(`http://localhost:3000/api/getscore`, {
      params: { id: userId },
    });

    const { points } = response.data;

    return (
      <div>
        <h1>Application</h1>
        <p>Protected page</p>
        <h1>session.user.id :- {session.user.id}</h1>
        <h1>session.user.name :- {session.user.name}</h1>
        <h1>session.user.email :- {session.user.email}</h1>
        <h1>session.user.image :- {session.user.image}</h1>
        <h2>Points: {points}</h2>
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch points:");
    notFound(); // Handle errors gracefully
  }
};

export default page;
