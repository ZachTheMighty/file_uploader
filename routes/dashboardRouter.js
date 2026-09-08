const Router = require("express");
const controller = require("../controllers/dashboardController.js");

const router = Router();

router.use((req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ msg: "You need to log in to view this resource." });
});

router.get("/", controller.dashboardGet);

module.exports = router;
