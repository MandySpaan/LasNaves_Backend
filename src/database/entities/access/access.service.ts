import mongoose from "mongoose";
import AccessHistory from "../accessHistory/accessHistory.model";
import Room from "../rooms/room.model";
import Access from "./access.model";

class AccessService {
  async currentOccupancy(roomId: string) {
    const currentDateTime = new Date();

    const currentOccupancy = await Access.find({
      roomId,
      entryDateTime: {
        $lte: currentDateTime,
      },
      status: "active",
    });

    if (!currentOccupancy || currentOccupancy.length === 0) {
      throw new Error("No current occupancy found");
    }

    const populatedOccupancy = await Promise.all(
      currentOccupancy.map((access) =>
        access.populate("userId", "name surname")
      )
    );

    const occupancyUsers = populatedOccupancy.map(
      (access: any) => `${access.userId.name} ${access.userId.surname}`
    );

    return occupancyUsers;
  }

  async checkIn(userId: string, roomId: string) {
    const room = await Room.findById(roomId);
    if (!room) {
      throw new Error("Room not found");
    }

    const currentDateTime = new Date();

    const activeAccess = await Access.findOne({
      userId,
      status: "active",
    }).populate({
      path: "roomId",
      select: "roomName",
    });

    if (activeAccess) {
      const roomId = (activeAccess as any).roomId;
      throw new Error(
        `You are already checked in at the room: ${roomId.roomName}`
      );
    }

    const currentReservation = await Access.findOne({
      userId,
      roomId,
      entryDateTime: {
        $lte: currentDateTime,
      },
      exitDateTime: { $gte: currentDateTime },
      status: "reserved",
    });

    if (currentReservation) {
      currentReservation.status = "active";
      await currentReservation.save();
      return currentReservation;
    }

    const reservationElsewhere = await Access.findOne({
      userId,
      entryDateTime: {
        $lte: currentDateTime,
      },
      exitDateTime: { $gte: currentDateTime },
      status: "reserved",
    }).populate({
      path: "roomId",
      select: "roomName",
    });

    if (reservationElsewhere) {
      const roomId = (reservationElsewhere as any).roomId;
      throw new Error(
        `You have a pending reservation for the room: ${roomId.roomName}`
      );
    }

    const currentRoomReservations = await Access.countDocuments({
      roomId,
      entryDateTime: {
        $lte: currentDateTime,
      },
      exitDateTime: { $gte: currentDateTime },
      status: "reserved",
    });

    const currentRoomOccupancy = await Access.countDocuments({
      roomId,
      status: "active",
    });

    const placesAvailable =
      room.capacity - currentRoomReservations - currentRoomOccupancy;
    if (placesAvailable <= 0) {
      throw new Error("Sorry, this room is full");
    }

    const newAccess = new Access({
      userId,
      roomId,
      entryDateTime: currentDateTime,
      status: "active",
    });

    await newAccess.save();
    return newAccess;
  }

  async checkOut(userId: string, roomId: string) {
    const access = await Access.findOne({ userId, roomId, status: "active" });

    if (!access) {
      throw new Error(`User not checked into roomId: ${roomId}`);
    }

    access.exitDateTime = new Date();

    const accessHistory = new AccessHistory({
      userId,
      roomId,
      entryDateTime: access.entryDateTime,
      exitDateTime: access.exitDateTime,
      status: "completed",
    });

    await accessHistory.save();
    await Access.deleteOne({ _id: access._id });
    return accessHistory;
  }

  async reservePlace(
    userId: string,
    roomId: string,
    entryDateTime: Date,
    exitDateTime: Date
  ) {
    if (isNaN(entryDateTime.getTime()) || isNaN(exitDateTime.getTime())) {
      throw new Error("Invalid date format");
    }

    if (entryDateTime > exitDateTime) {
      throw new Error("The entry time must be before the exit time");
    }

    const now = new Date();
    if (entryDateTime < now || exitDateTime < now) {
      throw new Error("The entry date cannot be in the past");
    }

    const room = await Room.findById(roomId);
    if (!room) {
      throw new Error("Room not found");
    }

    const existingReservation = await Access.findOne({
      userId,
      entryDateTime: {
        $lt: exitDateTime,
      },
      exitDateTime: { $gt: entryDateTime },
      status: "reserved",
    });

    if (existingReservation) {
      throw new Error(`You already have a reservation at that time`);
    }

    const occupancy = await Access.countDocuments({
      roomId,
      entryDateTime: { $lt: exitDateTime },
      exitDateTime: { $gt: entryDateTime },
    });

    const placesAvailable = room.capacity - occupancy;

    if (placesAvailable <= 0) {
      throw new Error("Sorry, this room is full at that time");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const newAccess = new Access({
        userId,
        roomId,
        entryDateTime,
        exitDateTime,
        status: "reserved",
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

  async cancelOwnReservation(userId: string, accessId: string) {
    const access = await Access.findOne({ _id: accessId });
    if (!access) {
      throw new Error("Reservation not found");
    }

    if ((access.userId as string).toString() !== userId) {
      throw new Error("User not authorized to cancel reservation");
    }

    if (access.status === "active") {
      throw new Error(
        "You are already checked in, please check out instead of cancelling"
      );
    }

    const accessHistory = new AccessHistory({
      userId,
      roomId: access.roomId,
      entryDateTime: access.entryDateTime,
      exitDateTime: access.exitDateTime,
      status: "cancelled",
    });

    await accessHistory.save();
    await Access.deleteOne({ _id: accessId });
    return accessHistory;
  }

  moveToHistory = async (currentDate: Date) => {
    const startOfToday = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );

    const oldAccesses = await Access.find({
      entryDateTime: { $lt: startOfToday },
    });

    if (!oldAccesses || oldAccesses.length === 0) {
      throw new Error("No old accesses found");
    }

    const newAccessHistories: any = [];

    await Promise.all(
      oldAccesses.map(async (access) => {
        let accessHistory;

        if (access.status === "active") {
          accessHistory = new AccessHistory({
            userId: access.userId,
            roomId: access.roomId,
            entryDateTime: access.entryDateTime,
            status: "completed (no check-out)",
          });
        } else if (access.status === "reserved") {
          accessHistory = new AccessHistory({
            userId: access.userId,
            roomId: access.roomId,
            entryDateTime: access.entryDateTime,
            exitDateTime: access.exitDateTime,
            status: "no-show",
          });
        }

        if (accessHistory) {
          await accessHistory.save();
          await Access.deleteOne({ _id: access._id });

          newAccessHistories.push(accessHistory);
        }
      })
    );
    return newAccessHistories;
  };
}

export default new AccessService();
