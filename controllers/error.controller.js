const AppError = require("../util/appError");

function handleCastErrorDB(err) {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
}
function handleDuplicateErrorDB() {
  const message =
    "The tour you named is already exist on the website please choose andother name and try again 😦 ";
  return new AppError(message, 400);
}

function handleValidatorErrorDb(err) {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid Validators ${errors.join(". ")}`;
  return new AppError(message, 400);
}

function handleJWTError() {
  return new AppError("invalid token, please login again", 401);
}

function handleTokenExpiredError() {
  return new AppError("Your session is expired please try again", 401);
}

function sendErrorForDev(err, req, res) {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  res.status(err.statusCode).render("error", {
    title: "Somethink went wrong",
    msg: err.message,
  });
}

function sendErrorForProd(err, req, res) {
  // API ERROR
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    console.log("Error 🔥 ", err.name);
    res.status(500).json({
      status: "error ",
      message: "Somethink went wrong! 🔥 ",
    });
  }
  // WEBSITE ERROR
  if (err.isOperational) {
    return res.status(err.statusCode).render("error", {
      title: "Error",
      msg: "Somethink went wrong!",
    });
  }
  console.error("ERROR 🔥 ", err);
  return res.status(err.statusCode).render("error", {
    title: "Error",
    msg: "Please Try Again Later!",
  });
}

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = Object.create(err);
    if (error.name === "CastError") {
      error = handleCastErrorDB(error);
    }
    if (error.code === 11000) {
      error = handleDuplicateErrorDB(error);
    }

    if (error.name === "ValidationError") {
      error = handleValidatorErrorDb(error);
    }

    if (error.name === "JsonWebTokenError") {
      error = handleJWTError(error);
    }
    if (error.name === "TokenExpiredError") {
      error = handleTokenExpiredError(error);
    }
    sendErrorForProd(error, req, res);
  }
};

module.exports = globalErrorHandler;
