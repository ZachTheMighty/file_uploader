const passport = require("passport");
const LocalStartegy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const prisma = require("./lib/prisma.ts");

const customFields = {
  usernameField: "email",
  passwordField: "password",
};

passport.use(
  new LocalStartegy(customFields, async (email, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user)
        return done(null, false, { message: "Incorrect email or password" });

      if (!(await bcrypt.compare(password, user.password)))
        return done(null, false, { message: "Incorrect email or password" });

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }),
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    done(null, user);
  } catch (error) {
    done(error);
  }
});
