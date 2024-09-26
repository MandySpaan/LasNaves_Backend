import mongoose, { Schema, Document } from "mongoose";

interface IUserAccessCount {
  name: string;
  count: number;
}

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
  frequentPeople: IUserAccessCount[];
  lessFrequentPeople: IUserAccessCount[];
  roomUsage: IRoomUsage[];
}

const UserAccessCountSchema: Schema = new Schema({
  name: { type: String, required: true },
  count: { type: Number, required: true },
});

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
  frequentPeople: { type: [UserAccessCountSchema], required: true },
  lessFrequentPeople: { type: [UserAccessCountSchema], required: true },
  roomUsage: { type: [RoomUsageSchema], required: true },
});

export default mongoose.model<IAdministration>(
  "Administration",
  AdministrationSchema
);
