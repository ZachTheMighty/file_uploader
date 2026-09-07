import express from "express";
import path from "node:path";
import { loadEnvFile } from "node:process";

try {
  loadEnvFile();
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const app = express();

app.get("/", (req, res) => res.send("niggar"));

const port = process.env.NODE_SERVER_PORT;
app.listen(port, (error) => {
  if (error) throw error;
  console.log(`listening to port ${port}`);
});
