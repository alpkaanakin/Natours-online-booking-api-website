const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");

const xss = require("x-xss-protection"); //
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");

const AppError = require("./util/appError");
const globalErrorHandler = require("./controllers/error.controller");

const userRoutes = require("./routes/user.routes");
const tourRoutes = require("./routes/tour.routes");
const reviewRoutes = require("./routes/review.routes");
const viewRoutes = require("./routes/view.routes");
const bookingRoutes = require("./routes/booking.routes");
const bookingController = require("./controllers/booking.controller");

const app = express();

//Implement cors
app.use(cors());

app.options("*", cors());
// app.options("/api/tours/:id", cors());

//Enable Proxy
app.enable("trust proxy");

//view engine configuration
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

//serving Static Files
app.use(express.static(path.join(__dirname, "public")));
// Set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", "data:", "blob:", "https:", "ws:"],
        baseUri: ["'self'"],
        fontSrc: ["'self'", "https:", "data:"],
        scriptSrc: [
          "'self'",
          "https:",
          "http:",
          "blob:",
          "http",

          "https://*.mapbox.com",
          "https://js.stripe.com",
          "https://m.stripe.network",
          "https://*.cloudflare.com",
        ],
        frameSrc: ["'self'", "https://js.stripe.com"],
        objectSrc: ["'none'"],
        styleSrc: ["'self'", "https:", "'unsafe-inline'"],
        workerSrc: [
          "'self'",
          "data:",
          "blob:",
          "https://*.tiles.mapbox.com",
          "https://api.mapbox.com",
          "https://events.mapbox.com",
          "https://m.stripe.network",
        ],
        childSrc: ["'self'", "blob:"],
        imgSrc: ["'self'", "data:", "blob:"],
        formAction: ["'self'"],
        connectSrc: [
          "'self'",
          "'unsafe-inline'",
          "data:",
          "blob:",
          "https://*.stripe.com",
          "https://*.mapbox.com",
          "https://*.cloudflare.com/",
          "https://index.js:*",
          "ws://127.0.0.1:*/",
        ],
        upgradeInsecureRequests: [],
      },
    },
  })
);

// Prevent parameter pollution

//Development or Production
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "çok fazla istekte bulunuyorsunuz lutfen sakin olun",
});
app.use("/api", limiter);

app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  bookingController.webhookCheckout
);

// Body parser, reading data from req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

//Data sanization against nosql enjection
app.use(mongoSanitize());
//Data sanization against xss
app.use(xss());

app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

app.use(compression());

app.use((req, res, next) => {
  console.log("request sent to server");
  next();
});

app.use("/", viewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/booking", bookingRoutes);
app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: "failed",
  //   message: `Can't find the route ${req.originalUrl} on this server`,
  // });

  next(
    new AppError(`Can't find the route ${req.originalUrl} on this server`, 404)
  );
});

app.use(globalErrorHandler);

module.exports = app;
