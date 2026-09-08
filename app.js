const express = require("express");
const path = require("node:path");
const session = require("express-session");
const passport = require("passport");
const prisma = require("./lib/prisma.ts");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");

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

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, //ms,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
    cookie: { maxAge: 1000 * 64 * 64 * 24 },
  }),
);

require("./passport.js");
app.use(passport.session());

const signUpRouter = require("./routes/signUpRouter.js");
const logInRouter = require("./routes/logInRouter.js");
const dashboardRouter = require("./routes/dashboardRouter.js");

app.use("/sign-up", signUpRouter);
app.use("/login", logInRouter);
app.use("/dashboard", dashboardRouter);
app.get("/logout", (req, res) =>
  req.logout((error) => {
    if (error) return error;
    res.redirect("/");
  }),
);
app.get("/", (req, res) => res.render("home.ejs"));
app.use((req, res) => res.status(404).send("page doesnt exist"));

const port = process.env.NODE_SERVER_PORT;
app.listen(port, (error) => {
  if (error) throw error;
  console.log(`listening to port ${port}`);
});
