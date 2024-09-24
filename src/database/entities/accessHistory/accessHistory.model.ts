import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../users/user.model";
import { IRoom } from "../rooms/room.model";

interface IAccessHistory extends Document {
  userId: IUser["_id"];
  roomId: IRoom["_id"];
  entryDateTime: Date;
  exitDateTime?: Date;
  status: "completed" | "no-show" | "cancelled";
}

const accessHistorySchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    entryDateTime: { type: Date, required: true },
    exitDateTime: { type: Date },
    status: {
      type: String,
      enum: ["completed", "no-show", "cancelled"],
      default: "completed",
    },
  },
  {
    timestamps: true,
  }
);

const AccessHistory = mongoose.model<IAccessHistory>(
  "AccessHistory",
  accessHistorySchema
);

export default AccessHistory;
