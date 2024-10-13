import AccessHistory from "../entities/accessHistory/accessHistory.model";
import User from "../entities/users/user.model";
import Room from "../entities/rooms/room.model";

function getRandomWeekdayDateWithinOneWeek(): Date {
  const now = new Date();
  const pastWeekStart = new Date(now);
  pastWeekStart.setDate(now.getDate() - 7);

  let date: Date;
  do {
    const randomDate = new Date(
      pastWeekStart.getTime() +
        Math.random() * (now.getTime() - pastWeekStart.getTime())
    );
    date = randomDate;
  } while (date.getDay() === 0 || date.getDay() === 6);

  const entryHour = Math.floor(Math.random() * (18 - 9)) + 9;
  const entryMinute = Math.floor(Math.random() * 60);
  date.setHours(entryHour, entryMinute, 0, 0);

  return date;
}

function getExitDateTime(entryDateTime: Date): Date {
  const exitDate = new Date(entryDateTime);
  const exitHour =
    Math.floor(Math.random() * (18 - entryDateTime.getHours())) +
    entryDateTime.getHours();
  const exitMinute = Math.floor(Math.random() * 60);
  exitDate.setHours(exitHour, exitMinute);
  return exitDate > entryDateTime ? exitDate : entryDateTime;
}

function getRandomFullHourWeekdayDateWithinOneWeek(): Date {
  const now = new Date();
  const pastWeekStart = new Date(now);
  pastWeekStart.setDate(now.getDate() - 7);

  let date: Date;
  do {
    const randomDate = new Date(
      pastWeekStart.getTime() +
        Math.random() * (now.getTime() - pastWeekStart.getTime())
    );
    date = randomDate;
  } while (date.getDay() === 0 || date.getDay() === 6);

  const entryHour = Math.floor(Math.random() * (17 - 9 + 1)) + 9;
  date.setHours(entryHour, 0, 0, 0);

  return date;
}

function getCancelledExitDateTime(entryDateTime: Date): Date {
  const exitDate = new Date(entryDateTime);
  const length = Math.floor(Math.random() * 9) + 1;
  exitDate.setHours(entryDateTime.getHours() + length, 0, 0, 0);
  return exitDate;
}

async function isOverlappingAccess(
  userId: any,
  entryDateTime: Date,
  exitDateTime: any
): Promise<boolean> {
  const overlappingRecord = await AccessHistory.findOne({
    userId,
    $or: [
      {
        entryDateTime: { $lt: exitDateTime },
        exitDateTime: { $gt: entryDateTime },
      },
      {
        entryDateTime: { $lt: exitDateTime },
        exitDateTime: { $exists: false },
      },
    ],
  });

  return !!overlappingRecord;
}

export async function accessHistorySeeder() {
  const completedCount = 42;
  const noCheckOutCount = 8;
  const noShowCount = 6;
  const cancelledCount = 4;

  const users = await User.find().select("_id").exec();
  const rooms = await Room.find().select("_id").exec();

  if (!users.length || !rooms.length) {
    console.log("No users or rooms available to create access history.");
    return;
  }

  const userIds = users.map((user) => user._id);
  const roomIds = rooms.map((room) => room._id);

  const getRandomUserId = () =>
    userIds[Math.floor(Math.random() * userIds.length)];
  const getRandomRoomId = () =>
    roomIds[Math.floor(Math.random() * roomIds.length)];

  const accessHistoryRecords = [];

  // Seed for "completed" status
  for (let i = 0; i < completedCount; i++) {
    let entryDate, exitDate;
    let userId = getRandomUserId();
    do {
      entryDate = getRandomWeekdayDateWithinOneWeek();
      exitDate = getExitDateTime(entryDate);
    } while (await isOverlappingAccess(userId, entryDate, exitDate));

    accessHistoryRecords.push({
      userId,
      roomId: getRandomRoomId(),
      entryDateTime: entryDate,
      exitDateTime: exitDate,
      status: "completed",
    });
  }

  // Seed for "completed (no check-out)" status
  for (let i = 0; i < noCheckOutCount; i++) {
    let entryDate;
    let userId = getRandomUserId();
    do {
      entryDate = getRandomWeekdayDateWithinOneWeek();
    } while (await isOverlappingAccess(userId, entryDate, null));

    accessHistoryRecords.push({
      userId,
      roomId: getRandomRoomId(),
      entryDateTime: entryDate,
      status: "completed (no check-out)",
    });
  }

  // Seed for "no-show" status
  for (let i = 0; i < noShowCount; i++) {
    let entryDate;
    let userId = getRandomUserId();
    do {
      entryDate = getRandomWeekdayDateWithinOneWeek();
    } while (await isOverlappingAccess(userId, entryDate, null));

    accessHistoryRecords.push({
      userId,
      roomId: getRandomRoomId(),
      entryDateTime: entryDate,
      status: "no-show",
    });
  }

  // Seed for "cancelled" status
  for (let i = 0; i < cancelledCount; i++) {
    let entryDate, exitDate;
    let userId = getRandomUserId();
    do {
      entryDate = getRandomFullHourWeekdayDateWithinOneWeek();
      exitDate = getCancelledExitDateTime(entryDate);
    } while (await isOverlappingAccess(userId, entryDate, exitDate));

    accessHistoryRecords.push({
      userId,
      roomId: getRandomRoomId(),
      entryDateTime: entryDate,
      exitDateTime: exitDate,
      status: "cancelled",
    });
  }

  try {
    await AccessHistory.insertMany(accessHistoryRecords);
    console.log(`AccessHistories seeded successfully`);
  } catch (error) {
    console.error("Error seeding AccessHistory:", error);
  }
}
