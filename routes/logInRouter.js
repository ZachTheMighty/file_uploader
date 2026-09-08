const Router = require("express");
const controller = require("../controllers/logInController.js");

const router = Router();

router.get("/", controller.logInGet);
router.post("/", controller.logInPost);

module.exports = router;
