const dashboardGet = (req, res) =>
  res.render("dashboard.ejs", {
    fullName: `${req.user.first_name} ${req.user.last_name}`,
  });

module.exports = {
  dashboardGet,
};
