"use client";
import React, { useState } from "react";
import Square from "./Square";
import StatusCard from "../StatusCard";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { FC } from "react";

interface NormalBordProps {
  gameid: string;
  players: {id: string, name: string,email:string}[];
  moves:string[];
  lastmoveId:String;
  islastX:boolean;
}

const calculateWinner = (squares: string[]): string | null => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const isBoardFull = (squares: string[]): boolean => {
  return squares.every(square => square !== "");
};

export const NormalBord: FC<NormalBordProps> = ({gameid,moves,lastmoveId,players,islastX}) => {
  const [xIsNext, setXIsNext] = useState<boolean>(islastX);
  const [squares, setSquares] = useState<string[]>(moves);
  const { data: session } = useSession();

  const handleClick = (i: number): void => {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    if(lastmoveId != ""){
      if(lastmoveId == session?.user?.id){
        return;
      }
    }
    if(players[0].id != session?.user?.id || players[1].id != session?.user?.id){
      const nextSquares = squares.slice();
      nextSquares[i] = xIsNext ? "X" : "O";
      setSquares(nextSquares);
      setXIsNext(!xIsNext);
      //api call to back end to set the move and update lastmoveId and islastX
    }else{
      return;
    }
  };

  const winner = calculateWinner(squares);
  let status: string;
  if (winner) {
    status = "Winner: " + winner;
    //api call to back end to set the winner
  } else if (isBoardFull(squares)) {
    status = "It's a draw!";
    //api call to back end to set the draw
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const handleReset = (): void => {
    setSquares(Array(9).fill(""));
    setXIsNext(true);
  };

  return (
    <div className="flex justify-center items-center p-8 gap-10">
      <StatusCard status={status}/>
      <div className="grid grid-cols-3 w-96">
        {[...Array(9)].map((_, idx) => (
          <Square key={idx} value={squares[idx]} onSquareClick={() => handleClick(idx)} />
        ))}
      </div>
      <Button onClick={handleReset}>Reset</Button>
    </div>
  );
};

export default NormalBord;
