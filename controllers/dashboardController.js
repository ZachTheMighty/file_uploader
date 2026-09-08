const prisma = require("../lib/prisma.ts");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { createClient } = require("@supabase/supabase-js");
const { body, validationResult, matchedData } = require("express-validator");

const { loadEnvFile } = require("node:process");

try {
  loadEnvFile();
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

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

const foldersPost = [
  body("folder").trim().notEmpty().withMessage("Folder name can't be empty"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res
        .status(400)
        .render("folders.ejs", { folders: [], errors: errors.array() });
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
  },
];

const folderGet = async (req, res) => {
  const folder = await prisma.folder.findUnique({
    where: { id: +req.params.id },
    include: { files: true },
  });

  res.render("files.ejs", { folder, files: folder.files });
};

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
);

const folderPost = [
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).send("No file uploaded");
      const { error } = await supabase.storage
        .from("files")
        .upload(req.file.originalname, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false,
        });
      if (error) throw error;
    } catch (error) {
      throw error;
    }
    await prisma.file.create({
      data: {
        name: req.file.originalname,
        size: req.file.size.toString(),
        url: supabase.storage.from("files").getPublicUrl(req.file.originalname)
          .data.publicUrl,
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

const folderDeleteGet = async (req, res) => {
  const deleteFiles = prisma.file.deleteMany({
    where: { folderId: +req.params.id },
  });
  const deleteFolders = prisma.folder.deleteMany({
    where: { id: +req.params.id },
  });

  await prisma.$transaction([deleteFiles, deleteFolders]);
  res.redirect("/dashboard/folders");
};

const folderUpdateGet = (req, res) =>
  res.render("folder_rename.ejs", { folderId: +req.params.id });

const folderUpdatePost = async (req, res) => {
  await prisma.folder.update({
    where: { id: +req.params.id },
    data: { name: req.body.folder },
  });
  res.redirect("/dashboard/folders");
};

module.exports = {
  dashboardGet,
  foldersGet,
  foldersPost,
  folderGet,
  folderPost,
  folderDeleteGet,
  folderUpdateGet,
  folderUpdatePost,
};
