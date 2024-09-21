import mongoose, { Schema, Document } from "mongoose";

interface IRoom extends Document {
  roomName: string;
  capacity: number;
  roomType: "Meeting Room" | "Office Space" | "Other";
}

const roomSchema: Schema = new Schema(
  {
    roomName: { type: String, required: true },
    capacity: { type: Number, required: true },
    roomType: {
      type: String,
      enum: ["Meeting Room", "Office Space", "Other"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model<IRoom>("Room", roomSchema);

export default Room;
