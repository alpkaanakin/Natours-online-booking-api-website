const express = require("express");
const reviewController = require("../controllers/review.controller");
const authController = require("../controllers/auth.controller");

const router = express.Router({ mergeParams: true });

router.use(authController.protectRoutes);

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(reviewController.setTourUserId, reviewController.createReview);

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo("admin", "user"),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo("admin", "user"),
    reviewController.deleteReview
  );

module.exports = router;
