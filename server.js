const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

process.on("uncaughtException", (err) => {
  .log(err.name, err.message, err.stack);
  .log("UNHANDLED UNCAUGHT EXCEPTION SERVER IS CLOSING... 💥  ");
  process.exit(1);
});

const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  // local database version
  // .connect(process.env.DATABASE_LOCAL, {
  // hosted database version
  .connect(DB, {
    // just some options to deal with deprecation warnings.
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => .log("DB connection successful!"));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  .log(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  .log(err.name, err.message);
  .log("UNHANDLED REJECTION SERVER IS CLOSING... 💥 ");
  server.close(() => process.exit(1));
});
