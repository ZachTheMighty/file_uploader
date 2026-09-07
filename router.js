const Router = require("express");
const controller = require("./controller.js");

const router = Router();

router.get("/", controller.homeGet);
router.get("/sign-up", controller.signUpGet);

module.exports = router;
