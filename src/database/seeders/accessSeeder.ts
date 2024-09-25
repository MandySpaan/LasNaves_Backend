import mongoose from "mongoose";
import Access from "../entities/access/access.model";
import User from "../entities/users/user.model";
import Room from "../entities/rooms/room.model";

function getWeekdayDates(start: Date, end: Date): Date[] {
  const dates: Date[] = [];
  const currentDate = new Date(start);

  while (currentDate <= end) {
    const day = currentDate.getUTCDay();
    if (day > 0 && day < 6) {
      dates.push(new Date(currentDate));
    }
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  return dates;
}

function getRandomPastDate(): Date {
  const now = new Date();

  const gmtPlus2Offset = 2 * 60 * 60 * 1000;
  const currentTime = new Date(now.getTime() + gmtPlus2Offset);

  const earliestTime = new Date(currentTime);
  earliestTime.setUTCHours(9, 0, 0, 0);

  if (currentTime < earliestTime) {
    throw new Error("Current time is before 09:00 (GMT+2)");
  }

  const randomMinutes = Math.floor(
    Math.random() * (currentTime.getUTCMinutes() + 1)
  );
  const randomHours =
    Math.floor(Math.random() * (currentTime.getUTCHours() - 9 + 1)) + 9;

  const entryDateTime = new Date(currentTime);
  entryDateTime.setUTCHours(randomHours, randomMinutes, 0, 0);

  return entryDateTime < currentTime ? entryDateTime : currentTime;
}

function getRandomFullHour(
  startHour: number,
  endHour: number,
  date: Date
): Date {
  const hour =
    Math.floor(Math.random() * (endHour - startHour + 1)) + startHour;
  date.setUTCHours(hour, 0, 0, 0);
  return date;
}

function getRandomDuration(): number {
  const oneHour = 60 * 60 * 1000;
  const nineHours = 9 * oneHour;
  return Math.floor(Math.random() * (nineHours - oneHour)) + oneHour;
}

export async function accessSeeder() {
  const numberOfCurrentActive = 10;
  const numberOfCurrentReserved = 2;
  const numberOfFutureReserved = 120;

  const users = await User.find({});
  const rooms = await Room.find({});

  const userIds = users.map((user) => user._id);
  const roomIds = rooms.map((room) => room._id);

  const currentDate = new Date();
  const twoWeeksFromNow = new Date();
  twoWeeksFromNow.setDate(currentDate.getDate() + 14);

  const validDates = getWeekdayDates(currentDate, twoWeeksFromNow);
  const accessData = [];

  // Seeds for current time with status 'active' (no exit time)
  for (let i = 0; i < numberOfCurrentActive; i++) {
    const roomId = roomIds[Math.floor(Math.random() * roomIds.length)];
    const userId = userIds[Math.floor(Math.random() * userIds.length)];
    const entryDateTime = getRandomPastDate();

    accessData.push({
      userId,
      roomId,
      entryDateTime,
      status: "active",
    });
  }

  // Seeds for current time with status 'reserved'
  for (let i = 0; i < numberOfCurrentReserved; i++) {
    const roomId = roomIds[Math.floor(Math.random() * roomIds.length)];
    const userId = userIds[Math.floor(Math.random() * userIds.length)];
    const entryDateTime = getRandomFullHour(9, 17, new Date());
    let exitDateTime = new Date(entryDateTime.getTime() + getRandomDuration());

    if (
      exitDateTime.getUTCHours() > 18 ||
      exitDateTime.getTime() - entryDateTime.getTime() > 9 * 60 * 60 * 1000
    ) {
      exitDateTime = new Date(entryDateTime);
      exitDateTime.setUTCHours(18, 0, 0, 0);
    }

    accessData.push({
      userId,
      roomId,
      entryDateTime,
      exitDateTime,
      status: "reserved",
    });
  }

  // Seeds for future time with status 'reserved'
  for (let i = 0; i < numberOfFutureReserved; i++) {
    const roomId = roomIds[Math.floor(Math.random() * roomIds.length)];
    const userId = userIds[Math.floor(Math.random() * userIds.length)];

    const randomDate =
      validDates[Math.floor(Math.random() * validDates.length)];
    const entryDateTime = getRandomFullHour(9, 17, randomDate);
    let exitDateTime = new Date(entryDateTime.getTime() + getRandomDuration());

    if (
      exitDateTime.getUTCHours() > 18 ||
      exitDateTime.getTime() - entryDateTime.getTime() > 9 * 60 * 60 * 1000
    ) {
      exitDateTime = new Date(entryDateTime);
      exitDateTime.setUTCHours(18, 0, 0, 0);
    }

    accessData.push({
      userId,
      roomId,
      entryDateTime,
      exitDateTime,
      status: "reserved",
    });
  }

  try {
    await Access.insertMany(accessData);
    console.log(`Accesses seeded successfully`);
  } catch (error) {
    console.error("Error seeding access data:", error);
  }
}
