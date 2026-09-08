const Router = require("express");
const controller = require("../controllers/signUpController.js");

const router = Router();

router.get("/", controller.signUpGet);
router.post("/", controller.signUpPost);

module.exports = router;
