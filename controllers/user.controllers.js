const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/user-models");
const AppError = require("../util/appError");
const handlerFactory = require("./handlerFactory");
const catchAsync = require("../util/catchAsync");

function getMe(req, res, next) {
  req.params.id = req.user.id;
  next();
}
const getAllUsers = handlerFactory.getAll(User);
const getUser = handlerFactory.getOne(User);
const deleteUser = handlerFactory.deleteOne(User);

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/img/users");
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     cb(null, `user-photo-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("The file you uploaded is not image", 404), false);
  }
};
const upload = multer({ storage: multerStorage, filter: multerFilter });

const updateMyPhoto = upload.single("photo");
const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-photo-${req.user.id}-${Date.now()}`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
});
const updateMe = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body);

  if (req.file) filteredBody.photo = req.file.filename;
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

module.exports = {
  getallUsers: getAllUsers,
  deleteUser: deleteUser,
  getUser: getUser,
  getMe: getMe,
  updateMe: updateMe,
  updateMyPhoto: updateMyPhoto,
  resizeUserPhoto: resizeUserPhoto,
};
