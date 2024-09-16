import express from "express";
import "dotenv/config";
import { dbConnection } from "./database/db";
import { router } from "./router";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/healthy", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
  });
});

app.use("/", router);

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
