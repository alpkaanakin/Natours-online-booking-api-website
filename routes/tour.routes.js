const express = require("express");
const tourController = require("../controllers/tour.controllers");
const authController = require("../controllers/auth.controller");
const reviewRoutes = require("./review.routes");

const router = express.Router();

router.use("/:tourId/reviews", reviewRoutes);

router
  .route("/")
  .get(tourController.getAllTours)
  .post(
    authController.protectRoutes,
    authController.restrictTo("admin", "lead-guide"),
    tourController.createNewTour
  );

router.route("/tour-stats").get(tourController.getTourStats);
router
  .route("/monthly-plan/:year")
  .get(
    authController.protectRoutes,
    authController.restrictTo("admin", "lead-guide"),
    tourController.getMonthlyPlan
  );

router
  .route("/top-3-tours")
  .get(tourController.topTours, tourController.getAllTours);

router
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(tourController.getToursWithIn);
router.route("/distances/:latlng/unit/:unit").get(tourController.getDistances);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(
    authController.protectRoutes,
    authController.restrictTo("admin", "lead-guide"),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    authController.protectRoutes,
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour
  );

module.exports = router;
