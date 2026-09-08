const prisma = require("../lib/prisma.ts");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const dashboardGet = (req, res) =>
  res.render("dashboard.ejs", {
    fullName: `${req.user.first_name} ${req.user.last_name}`,
  });

const foldersGet = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { folders: true },
  });
  res.render("folders.ejs", {
    folders: user.folders,
  });
};

const foldersPost = async (req, res) => {
  await prisma.folder.create({
    data: {
      name: req.body.folder,
      user: {
        connect: {
          id: req.user.id,
        },
      },
    },
  });
  res.redirect("/dashboard/folders");
};

const folderGet = async (req, res) => {
  const folder = await prisma.folder.findUnique({
    where: { id: +req.params.id },
    include: { files: true },
  });

  res.render("files.ejs", { folder, files: folder.files });
};

const folderPost = [
  upload.single("file"),
  async (req, res) => {
    console.log(req.file);
    await prisma.file.create({
      data: {
        name: req.file.originalname,
        size: req.file.size.toString(),
        url: req.file.destination,
        folder: {
          connect: {
            id: +req.params.id,
          },
        },
      },
    });
    res.redirect("/dashboard/folders");
  },
];

module.exports = {
  dashboardGet,
  foldersGet,
  foldersPost,
  folderGet,
  folderPost,
};
