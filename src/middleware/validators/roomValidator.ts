import { body } from "express-validator";

class RoomValidator {
  static createRoom() {
    const roomTypeEnum = ["Meeting Room", "Office Space", "Other"];
    return [
      body("roomName").notEmpty().withMessage("Room name is required"),
      body("capacity").notEmpty().withMessage("Capacity is required"),
      body("roomType")
        .notEmpty()
        .withMessage("Room type is required")
        .isIn(roomTypeEnum)
        .withMessage(
          "Invalid room type. Must be one of: " + roomTypeEnum.join(", ")
        ),
    ];
  }
}

export default RoomValidator;
