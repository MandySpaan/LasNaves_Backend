import express from "express";
import cors from "cors";
import path from "path";
import "express-async-errors";
import "dotenv/config";
import { dbConnection } from "./database/db";
import { router } from "./router";
import errorHandler from "./middleware/error.middleware";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get("/healthy", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
  });
});

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/", router);

app.use(errorHandler);

dbConnection()
  .then(() => {
    console.log("Databse connected");
    app.listen(PORT, () => {
      console.log(`server runnig ${PORT}`);
    });
  })
  .catch((error: any) => {
    console.log("Error connection database:" + error);
  });
