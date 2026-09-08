const Router = require("express");
const controller = require("../controllers/dashboardController.js");

const router = Router();

router.get("/", controller.dashboardGet);

module.exports = router;
