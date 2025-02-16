import NormalBord from "@/components/Normal/NormalBord";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";

const Page = async ({ params }: { params: { roomid: string } }) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const userId = session.user?.id;
  const roomid = params.roomid;

  return (
    <div>
      <NormalBord playersid={userId} roomid={roomid} />
    </div>
  );
};

export default Page;