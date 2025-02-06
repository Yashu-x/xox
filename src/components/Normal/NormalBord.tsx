"use client";
import React, { useState, useEffect, FC } from "react";
import Square from "./Square";
import StatusCard from "../StatusCard";
import axios from "axios";

interface NormalBordProps {
  roomid: string;
  playersid: string;
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

export const NormalBord: FC<NormalBordProps> = ({roomid })=>{
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [squares, setSquares] = useState<string[]>(Array(9).fill(""));

  useEffect(() => {
    // Define the API call function
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/game",
          {
            params: { id: roomid },
          }
        ); 
        console.log(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    // Call the API function
    fetchData();
    console.log("fetching data");
  }, []); // Empty dependency array means this effect runs once on mount
  
  const handleClick = (i: number): void => {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  };

  const winner = calculateWinner(squares);
  let status: string;
  if (winner) {
    status = "Winner: " + winner;
  } else if (isBoardFull(squares)) {
    status = "It's a draw!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <div className="flex justify-center items-center p-8 gap-10">
      <StatusCard status={status}/>
      <div className="grid grid-cols-3 w-96">
        {[...Array(9)].map((_, idx) => (
          <Square key={idx} value={squares[idx]} onSquareClick={() => handleClick(idx)} />
        ))}
      </div>
    </div>
  );
};

export default NormalBord;