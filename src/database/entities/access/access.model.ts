import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../users/user.model";
import { IRoom } from "../rooms/room.model";

interface IAccess extends Document {
  userId: IUser["_id"];
  roomId: IRoom["_id"];
  entryDateTime: Date;
  exitDateTime?: Date;
  status: "entry" | "exit";
}

const accessSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    entryDateTime: { type: Date, required: true },
    exitDateTime: { type: Date },
    status: { type: String, enum: ["entry", "exit"], required: true },
  },
  {
    timestamps: true,
  }
);

const Access = mongoose.model<IAccess>("Access", accessSchema);

export default Access;
