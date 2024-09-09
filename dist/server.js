"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const db_1 = require("./database/db");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.get("/healthy", (req, res) => {
    res.json({
        success: true,
        message: "Server is healthy",
    });
});
(0, db_1.dbConnection)()
    .then(() => {
    console.log("Databse connected");
    app.listen(PORT, () => {
        console.log(`server runnig ${PORT}`);
    });
})
    .catch((error) => {
    console.log("Error connection database:" + error);
});
