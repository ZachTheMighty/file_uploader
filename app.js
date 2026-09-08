const express = require("express");
const path = require("node:path");
const router = require("./router.js");
const { loadEnvFile } = require("node:process");

try {
  loadEnvFile();
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("views engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.use("/", router);

const port = process.env.NODE_SERVER_PORT;
app.listen(port, (error) => {
  if (error) throw error;
  console.log(`listening to port ${port}`);
});
