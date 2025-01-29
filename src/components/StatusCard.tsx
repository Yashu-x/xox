import React, { FC } from "react";
import { Card, CardContent, CardTitle } from "./ui/card";
import XorO from "./XorO";

interface StatusCardProps {
  status: string;
}

const StatusCard: FC<StatusCardProps> = ({ status }) => {
  let message = "";
  let xoro = "D";

  if (status.includes("Winner:")) {
    message = `Winner of the game is: "${status.includes("X") ? "X" : "O"}"`;
    xoro = status.includes("X") ? "X" : "O";
  } else if (status.includes("It's a draw!")) {
    message = "It's a draw!";
    xoro = "D";
  } else {
    message = `Next player: "${status.includes("X") ? "X" : "O"}"`;
    xoro = status.includes("X") ? "X" : "O";
  }

  return (
    <div className="flex justify-center items-center">
      <Card>
        <CardTitle className="text-center">{message}</CardTitle>
        <CardContent className="flex justify-center">
          <XorO value={xoro} />
        </CardContent>
      </Card>
    </div>
  );
};

export default StatusCard;
