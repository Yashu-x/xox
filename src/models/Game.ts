import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGame extends Document {
  roomId: string;
  players: string[];
  moves: string[];
  winner: string;
  createdAt: Date;
}

const gameSchema = new Schema<IGame>({
  roomId: { type: String, required: true },
  players: [String], // Array of player IDs
  moves: {type:[String],default:["","","","","","","","",""]}, // List of moves
  winner: { type: String, default: null }, // X, O, or null for ongoing games
  createdAt: { type: Date, default: Date.now },
});

const Game: Model<IGame> = mongoose.models.Game || mongoose.model<IGame>("Game", gameSchema);

export default Game;
