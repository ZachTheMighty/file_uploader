const prisma = require("./lib/prisma.ts");

const homeGet = (req, res) => res.render("home.ejs");

const signUpGet = (req, res) => res.render("sign_up.ejs");

const signUpPost = (req, res) => {
  prisma.user.create({
    data: {
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
    },
  });
  res.redirect("/login");
};

module.exports = {
  homeGet,
  signUpGet,
  signUpPost,
};
