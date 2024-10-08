"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dbConnection = () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        throw new Error("MONGO_URI is not defined in the environment variables");
    }
    return mongoose_1.default.connect(mongoUri, {});
};
exports.dbConnection = dbConnection;
