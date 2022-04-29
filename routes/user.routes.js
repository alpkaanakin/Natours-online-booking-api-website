const express = require("express");
const userController = require("../controllers/user.controllers");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logOut);
router.post("/forgotpassword", authController.forgotPassword);
router.patch("/resetpassword/:token", authController.resetPassword);

router.use(authController.protectRoutes);

router.get("/me", userController.getMe, userController.getUser);

router.patch("/updatepassword", authController.updatePassword);
router.patch("/updatemail", authController.updateEmail);
router.patch(
  "/updateMe",
  userController.updateMyPhoto,
  userController.resizeUserPhoto,
  userController.getMe,
  userController.updateMe
);
router.delete("/deleteMe", authController.deleteMe);

router
  .route("/")
  .get(authController.restrictTo("admin"), userController.getallUsers);

router
  .route("/:id")
  .delete(authController.restrictTo("admin"), userController.deleteUser)
  .get(userController.getUser);

module.exports = router;
