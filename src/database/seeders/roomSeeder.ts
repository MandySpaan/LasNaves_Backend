import Room from "../entities/room/room.model";

export const roomSeeder = async () => {
  const rooms = [
    {
      roomName: "Team Collaboration Room",
      capacity: 20,
      roomType: "Meeting Room",
    },
    {
      roomName: "Small Meeting Room",
      capacity: 6,
      roomType: "Meeting Room",
    },
    {
      roomName: "Quiet Workspace",
      capacity: 10,
      roomType: "Office Space",
    },
    {
      roomName: "Coworking Space",
      capacity: 35,
      roomType: "Office Space",
    },
    {
      roomName: "Creative Studio",
      capacity: 3,
      roomType: "Other",
    },
  ];

  try {
    await Room.insertMany(rooms);
    console.log("Rooms seeded successfully");
  } catch (error) {
    console.error("Error seeding rooms:", error);
  }
};
