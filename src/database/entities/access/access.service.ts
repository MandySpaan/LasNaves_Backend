import mongoose from "mongoose";
import AccessHistory from "../accessHistory/accessHistory.model";
import Room from "../rooms/room.model";
import Access from "./access.model";

class AccessService {
  async checkIn(userId: string, roomId: string) {
    const room = await Room.findById(roomId);
    if (!room) {
      throw new Error("Room not found");
    }

    const currentDateTime = new Date();

    const existingAccess = await Access.findOne({
      userId,
      roomId,
      entryDateTime: {
        $lte: currentDateTime,
      },
      exitDateTime: { $gte: currentDateTime },
    });

    if (existingAccess) {
      if (existingAccess.active) {
        throw new Error("User already checked in");
      }
      existingAccess.active = true;
      await existingAccess.save();
      return existingAccess;
    }

    const accessElsewhere = await Access.findOne({
      userId,
      entryDateTime: {
        $lte: currentDateTime,
      },
      exitDateTime: { $gte: currentDateTime },
    });

    if (accessElsewhere) {
      if (accessElsewhere.active) {
        throw new Error(
          `User already checked in at roomId: ${accessElsewhere.roomId}`
        );
      }
      throw new Error(
        `User has a reservation at roomId: ${accessElsewhere.roomId}`
      );
    }

    const currentOccupancy = await Access.countDocuments({
      roomId,
      entryDateTime: {
        $lte: currentDateTime,
      },
      exitDateTime: { $gte: currentDateTime },
    });

    const placesAvailable = room.capacity - currentOccupancy;
    if (placesAvailable <= 0) {
      throw new Error("Room is full");
    }

    const newAccess = new Access({
      userId,
      roomId,
      entryDateTime: currentDateTime,
    });

    await newAccess.save();
    return newAccess;
  }

  async checkOut(userId: string, roomId: string) {
    const access = await Access.findOne({ userId, roomId, active: true });

    if (!access) {
      throw new Error("User not checked in");
    }

    access.exitDateTime = new Date();
    access.active = false;

    const accessHistory = new AccessHistory({
      userId,
      roomId,
      entryDateTime: access.entryDateTime,
      exitDateTime: access.exitDateTime,
    });

    await accessHistory.save();
    await Access.deleteOne({ _id: access._id });
    return accessHistory;
  }

  async reservePlace(
    userId: string,
    roomId: string,
    rawEntryDateTime: Date,
    rawExitDateTime: Date
  ) {
    const entryDateTime = new Date(rawEntryDateTime);
    const exitDateTime = new Date(rawExitDateTime);

    if (isNaN(entryDateTime.getTime()) || isNaN(exitDateTime.getTime())) {
      throw new Error("Invalid date format");
    }

    if (entryDateTime > exitDateTime) {
      throw new Error("Entry date must be before exit date");
    }

    const now = new Date();
    if (entryDateTime < now || exitDateTime < now) {
      throw new Error("Entry and exit date must be in the future");
    }

    const room = await Room.findById(roomId);
    if (!room) {
      throw new Error("Room not found");
    }

    const existingReservation = await Access.findOne({
      userId,
      roomId,
      entryDateTime: {
        $lt: exitDateTime,
      },
      exitDateTime: { $gt: entryDateTime },
    });

    if (existingReservation) {
      throw new Error(
        `User already has a reservation from ${existingReservation.entryDateTime} to ${existingReservation.exitDateTime}`
      );
    }

    const occupancy = await Access.countDocuments({
      roomId,
      entryDateTime: { $lt: exitDateTime },
      exitDateTime: { $gt: entryDateTime },
    });

    const placesAvailable = room.capacity - occupancy;

    if (placesAvailable <= 0) {
      throw new Error("No places available");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const newAccess = new Access({
        userId,
        roomId,
        entryDateTime,
        exitDateTime,
        active: false,
      });

      await newAccess.save({ session });
      await session.commitTransaction();
      session.endSession();
      return newAccess;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new Error("Failed to reserve place");
    }
  }
}

export default new AccessService();
