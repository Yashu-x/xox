import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGame extends Document {
  roomId: string;
  players: { id: string, symbol: string }[]; // Array of player objects with IDs and symbols
  moves: string[]; // List of moves
  currentPlayer: string; // ID of the current player
  winner: string; // X, O, or null for ongoing games
  status: string; // "waiting", "ongoing", "finished"
  createdAt: Date;
}

const gameSchema = new Schema<IGame>({
  roomId: { type: String, required: true, unique: true },
  players: [{ id: String, symbol: String }],
  moves: { type: [String], default: Array(9).fill("") },
  currentPlayer: { type: String, default: null },
  winner: { type: String, default: null },
  status: { type: String, default: "waiting" },
  createdAt: { type: Date, default: Date.now },
});

const Game: Model<IGame> = mongoose.models.Game || mongoose.model<IGame>("Game", gameSchema);

export default Game;