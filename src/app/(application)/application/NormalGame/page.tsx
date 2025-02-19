"use client"; // Mark this component as a Client Component

import NormalBord from "@/components/Normal/NormalBord";
import { useSession } from "next-auth/react"; // Use client-side session hook
import { notFound } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const { data: session, status } = useSession(); // Get session on the client side
  const [roomid, setRoomid] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve the `roomid` from the query parameters
    const queryParams = new URLSearchParams(window.location.search);
    const roomidFromQuery = queryParams.get("roomid");

    if (roomidFromQuery) {
      setRoomid(roomidFromQuery);
    }
  }, []);

  // Redirect to 404 if there's no session
  if (status === "unauthenticated") {
    notFound();
  }

  // Show loading state while session or roomid is being fetched
  if (status === "loading" || !roomid) {
    return <div>Loading...</div>;
  }

  // Get the user ID from the session
  const userId = session?.user?.id;
  console.log(userId)

  return (
    <div>
      {/* Pass the `userId` and `roomid` as props to the `NormalBord` component */}
      <NormalBord  roomid={roomid} />
    </div>
  );
};

export default Page;