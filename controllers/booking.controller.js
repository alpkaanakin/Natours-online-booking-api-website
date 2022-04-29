const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Tour = require("../models/tour-models");
const Booking = require("../models/booking-model");
const catchAsync = require("../util/catchAsync");
const handlerFactory = require("./handlerFactory");
const AppError = require("../util/appError");

const getCheckoutSession = async (req, res, next) => {
  // Get tour data //
  const tour = await Tour.findById(req.params.tourId);
  // Create stripe session //
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: `${tour.summary}`,
        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
        amount: tour.price * 100,
        currency: "usd",
        quantity: 1,
      },
    ],
  });
  // Send session as response
  res.status(200).json({
    status: "sucess",
    session,
  });
};

const createBookingCheckout = catchAsync(async (req, res, next) => {
  // Unsecure //
  const { tour, user, price } = req.query;
  if (!tour && !user && !price) {
    return next();
  }
  await Booking.create({ tour, user, price });
  res.redirect(req.originalUrl.split("?")[0]);
});

const createBooking = handlerFactory.createOne(Booking);
const getBooking = handlerFactory.getOne(Booking);
const getAllBookings = handlerFactory.getAll(Booking);
const updateBooking = handlerFactory.updateOne(Booking);
const deleteBooking = handlerFactory.deleteOne(Booking);

module.exports = {
  getCheckoutSession: getCheckoutSession,
  createBookingCheckout: createBookingCheckout,
  createBooking: createBooking,
  getBooking: getBooking,
  getAllBookings: getAllBookings,
  updateBooking: updateBooking,
  deleteBooking: deleteBooking,
};
