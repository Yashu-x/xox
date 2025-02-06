import NormalBord from "@/components/Normal/NormalBord";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const userId = session.user?.id;

    return (
      <div>
        <NormalBord playersid={userId} roomid="room-1738840471045"/>
      </div>
    );
};

export default Page;
