const { body, validationResult, matchedData } = require("express-validator");
const passport = require("passport");

const logInGet = (req, res) => res.render("login.ejs");

const emptyError = "field can't be empty.";

const validateUser = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage(`Email ${emptyError}`)
    .isEmail()
    .withMessage(`Email must be in the format a@b.domain`),
  body("password")
    .trim()
    .notEmpty()
    .withMessage(`Password ${emptyError}`)
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      `Password must be between 8 and 24  characters, and must contain at least one number and one symbol`,
    )
    .isLength({ max: 24 })
    .withMessage("Password must be between 8 and 24 characters"),
];

const logInPost = [
  validateUser,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).render("login.ejs", { errors: errors.array() });

    next();
  },

  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureMessage: true,
  }),
];

module.exports = {
  logInGet,
  logInPost,
};
