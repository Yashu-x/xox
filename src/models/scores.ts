import mongoose, { Schema, Document, Model } from "mongoose";

export interface IScores extends Document {
  id?: string;
  points?: number;
}

const ScoresSchema = new Schema<IScores>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  points: {
    type: Number,
    required: true,
    default: 0,
  },
});

const Scores: Model<IScores> =
  mongoose.models.Scores || mongoose.model<IScores>("Scores", ScoresSchema);

export default Scores;
