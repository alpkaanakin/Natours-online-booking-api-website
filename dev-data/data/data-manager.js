const mongoose = require("mongoose");
const fs = require("fs");
const dotenv = require("dotenv");
const Review = require("../../models/review-model");
const Tour = require("../../models/tour-models");
const User = require("../../models/user-models");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connection succesful");
  });
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
);

async function importData() {
  try {
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    await Tour.create(tours);
    console.log("datas sucessfully imported from database");
  } catch (err) {
    console.log(err);
  }
}

async function deleteTours() {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("datas sucessfully deleted from database");
  } catch (err) {
    console.log(err);
  }
}

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteTours();
}
