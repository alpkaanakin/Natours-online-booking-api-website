const Review = require("../models/review-model");
const handlerFactory = require("./handlerFactory");

function setTourUserId(req, res, next) {
  if (!req.body.tour) {
    req.body.tour = req.params.tourId;
  }
  if (!req.body.user) {
    req.body.user = req.user.id;
  }
  next();
}

const getAllReviews = handlerFactory.getAll(Review);
const getReview = handlerFactory.getOne(Review);
const createReview = handlerFactory.createOne(Review);
const deleteReview = handlerFactory.deleteOne(Review);
const updateReview = handlerFactory.updateOne(Review);

module.exports = {
  getAllReviews: getAllReviews,
  createReview: createReview,
  deleteReview: deleteReview,
  updateReview: updateReview,
  setTourUserId: setTourUserId,
  getReview: getReview,
};
