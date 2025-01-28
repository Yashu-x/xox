import mongoose, { Schema, Document, Model } from "mongoose";

export interface IChallage extends Document {
  player1id: string;
  player2id: string;
}

const challageSchema = new Schema<IChallage>({
  player1id: {
    type: String,
    required: true,
    unique: true,
  },
  player2id: {
    type: String,
    required: true,
    unique: true,
  },
});

const challage: Model<IChallage> =
  mongoose.models.challage ||
  mongoose.model<IChallage>("challage", challageSchema);

export default challage;
