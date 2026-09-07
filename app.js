const express = require("express");
const path = require("node:path");
const { loadEnvFile } = require("node:process");

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
