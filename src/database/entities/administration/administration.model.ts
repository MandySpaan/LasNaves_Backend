import mongoose, { Schema, Document } from "mongoose";

export interface IRoomUsage {
  roomName: string;
  capacity: number;
  totalAccesses: number;
  totalAbsences: number;
  averageStayDuration: number;
  hourlyAccess: number[];
}

export interface IAdministration extends Document {
  reportDate: Date;
  totalAccesses: number;
  totalAbsences: number;
  frequentPeople: string[];
  lessFrequentPeople: string[];
  roomUsage: IRoomUsage[];
}

const RoomUsageSchema: Schema = new Schema({
  roomName: { type: String, required: true },
  capacity: { type: Number, required: true },
  totalAccesses: { type: Number, required: true },
  totalAbsences: { type: Number, required: true },
  averageStayDuration: { type: Number, required: true },
  hourlyAccess: {
    type: [Number],
    required: true,
  },
});

const AdministrationSchema: Schema = new Schema({
  reportDate: { type: Date, required: true },
  totalAccesses: { type: Number, required: true },
  totalAbsences: { type: Number, required: true },
  frequentPeople: { type: [String], required: true },
  lessFrequentPeople: { type: [String], required: true },
  roomUsage: { type: [RoomUsageSchema], required: true },
});

export default mongoose.model<IAdministration>(
  "Administration",
  AdministrationSchema
);
