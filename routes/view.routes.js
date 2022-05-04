const express = require("express");
const viewController = require("../controllers/view.controller");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.use(viewController.alerts);

// router.use(authController.isLoggeedIn);

router.get("/", authController.isLoggedIn, viewController.getOverview);
router.get("/signup", viewController.getSignUp);
router.get("/tours/:slug", authController.isLoggedIn, viewController.getTour);
router.get("/login", authController.isLoggedIn, viewController.getLogin);
router.get("/me", authController.protectRoutes, viewController.getAccount);
router.get(
  "/my-tours",
  authController.protectRoutes,
  viewController.getMyTours
);

module.exports = router;
