const homeGet = (req, res) => res.render("home.ejs");

const signUpGet = (req, res) => res.render("sign_up.ejs");

module.exports = {
  homeGet,
  signUpGet,
};
