const passport = require("passport");

const logInGet = (req, res) => res.render("login.ejs");

const logInPost = passport.authenticate("local", {
  successRedirect: "/dashboard",
  failureRedirect: "/login",
  failureMessage: true,
});

module.exports = {
  logInGet,
  logInPost,
};
