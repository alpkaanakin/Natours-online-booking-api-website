const Tour = require("../models/tour-models");
const catchAsync = require("../util/catchAsync");
const Bookings = require("../models/booking-model");

const getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).render("overview", {
    title: "Exciting tours for adventurous people",
    tours,
  });
});

const getTour = catchAsync(async (req, res, next) => {
  // get data from req.params tours,reviews,guides //
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });

  //Template//

  res.status(200).render("tour", {
    title: `${tour.name} Tour`,
    tour,
  });
});

const getSignUp = async (req, res) => {
  res
    .status(200)
    .render("signup", { title: "signup and enjoy fantastic tours" });
};

const getLogin = async (req, res) => {
  res.status(200).render("login", { title: "login your account" });
};

const getAccount = async (req, res) => {
  res.status(200).render("myAccount", { title: "My Account" });
};

const getMyTours = async (req, res, next) => {
  //Find All bookings
  const bookings = await Bookings.find({ user: req.user.id });
  // Find tours swith the returned IDs
  const tourIds = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } });

  res.status(200).render("overview", { title: "My tours", tours });
};

module.exports = {
  getOverview: getOverview,
  getTour: getTour,
  getLogin: getLogin,
  getAccount: getAccount,
  getMyTours: getMyTours,
  getSignUp: getSignUp,
};
