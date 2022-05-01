const { promisify } = require("util");
const crypto = require("crypto");

const jwt = require("jsonwebtoken");
const User = require("../models/user-models");
const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const Email = require("../util/email");

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

function createSendToken(user, statusCode, req, res) {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 90 * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers("x-forwarded-proto") === "https",
  };

  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
}

const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });
  const url = `${req.protocol}://${req.get("host")}/me`;
  createSendToken(newUser, 201, req, res);
  await new Email(newUser, url).sendWelcome();
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, req, res);
});

const logOut = (req, res) => {
  res.cookie("jwt", "Logged Out", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

const protectRoutes = catchAsync(async (req, res, next) => {
  // Check the token //
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    next(new AppError("Plaese Login your account", 401));
  }
  // Veritify Token //
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if user still exist // and

  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError("The user no longer exist"));
  }

  // check if user change password after the token has issued //
  if (freshUser.changesPasswordAfter(decoded.iat)) {
    return next(
      new AppError("oturum kapatildi lutfen tekrar giris yapiniz", 401)
    );
  }
  res.locals.user = freshUser;
  req.user = freshUser;
  next();
});

const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "You do not have the permision to perform this action",
          404
        )
      );
    }
    next();
  };

const isLoggedIn = async (req, res, next) => {
  // Check the token //
  try {
    if (req.cookies.jwt) {
      // Veritify Token //
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      const freshUser = await User.findById(decoded.id);
      if (!freshUser) {
        return next();
      }

      // check if user change password after the token has issued //
      if (freshUser.changesPasswordAfter(decoded.iat)) {
        return next();
      }

      //There is a logged User
      res.locals.user = freshUser;
      return next();
    }
  } catch (err) {
    return next();
  }
  next();
};

// Check if user still exist // and

const forgotPassword = catchAsync(async (req, res, next) => {
  // get User by email//
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError("User not exist, you can signup as a new user", 404)
    );
  }

  // Generate the random reset Token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // send it to user email //

  try {
    const resetURL = `${req.protocol}://${req.hostname}/api/users/users/resetpassword/:${resetToken}`;
    await new Email(user, resetURL).sendPasswordResetToken();
    res.status(200).json({
      status: "success",
      message: "email sifirlama baglantisi gonderildi",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError(err, 500));
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  // get User by Token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
  });
  //check if token not expires
  if (!user) {
    next(
      new AppError(
        "Baglanti linki gecersiz ya da suresi dolmus lutfen yeniden deneyin",
        400
      )
    );
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  await user.save();
  //update password changetime and
  //log the user in
  createSendToken(user, 200, req, res);
});

const updatePassword = catchAsync(async (req, res, next) => {
  //Get User //
  const user = await User.findById(req.user.id).select("+password");
  //Check credentials
  const verify = await user.correctPassword(
    req.body.currentPassword,
    user.password
  );
  if (!verify) {
    return next(
      new AppError(
        "Sifre hatali, mevcut sifrenizi yeniden girerek tekrar deneyin",
        401
      )
    );
  }
  // Update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  //Create new token
  createSendToken(user, 200, req, res);

  //send Email
  // sendEmail({
  //   email: user.email,
  //   subject: "Parolaniz basariyla degistirilmistir",
  //   message: `Merhaba ${user.name},
  //   Sifreniz basariyla degistirilmistir eger bu degisikligi siz yapmadiysaniz bu baglantiya tiklayarak hesabinizi guvene alabilirsiniz`,
  // });
});

const updateEmail = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const verify = await user.correctPassword(req.body.password, user.password);
  if (!verify) {
    return next(new AppError("Yanlis sifre", 401));
  }
  const oldMail = user.email;
  user.email = req.body.email;
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(user, 200, req, res);

  // sendEmail({
  //   email: oldMail,
  //   subject: "eposta adresiniz basariyla degistirilmistir",
  //   message: `Merhaba ${user.name},
  //   eposta adresiniz basariyla degistirilmistir, eger bu degisikligi siz yapmadiysaniz bu baglantiya tiklayarak hesabinizi guvene alabilirsiniz`,
  // });
});

const deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id)
    .select("+password")
    .select("+active");
  const verify = await user.correctPassword(req.body.password, user.password);
  if (!verify) {
    return next(new AppError("Yanlis sifre", 401));
  }
  user.active = false;
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  res
    .status(200)
    .json({ status: "success", message: "Kullanici basariyla silindi" });
});

module.exports = {
  login: login,
  signup: signup,
  protectRoutes: protectRoutes,
  isLoggedIn: isLoggedIn,
  restrictTo: restrictTo,
  forgotPassword: forgotPassword,
  resetPassword: resetPassword,
  updatePassword: updatePassword,
  updateEmail: updateEmail,
  deleteMe: deleteMe,
  logOut: logOut,
};
