import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";
import axios from "axios";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const userId = session?.user?.id;
  let points = 0;

  try {
    // Fetch the points using Axios
    const response = await axios.get(`http://localhost:3000/api/getscore`, {
      params: { id: userId },
      headers: {
        "Content-Type": "application/json",
      },
    });

    points = response.data.points || 0;
  } catch (error) {
    console.error("Error fetching points:");
    console.error(error);
  }

  return (
    <div>
      <h1>Application</h1>
      <p>Protected page</p>
      <h1>Session User ID: {userId}</h1>
      <h2>Points: {points}</h2>
    </div>
  );
};

export default Page;
