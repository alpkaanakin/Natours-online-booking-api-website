const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const APIFeatures = require("../util/apiFeatures");

const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // to allow nestedget review (tour bazli filtre uygulamak icin)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    //
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();
    const doc = await features.query;

    res.status(200).json({
      status: "succes",
      data: {
        data: doc,
      },
    });
  });

const getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) {
      query = query.populate(popOptions);
    }
    const doc = await query;
    if (!doc) {
      return next(new AppError("no document find with that ID", 404));
    }
    res.status(200).json({
      status: "succes",
      data: {
        data: doc,
      },
    });
  });

const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(200).json({ status: "succes", data: { data: doc } });
  });

const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError("no documant find with that ID", 404));
    }
    res.status(204).json({ status: "succes", data: null });
  });

const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError("no documant find with that ID", 404));
    }
    res.status(200).json({ status: "succes", data: { data: doc } });
  });

module.exports = {
  getAll: getAll,
  getOne: getOne,
  createOne: createOne,
  deleteOne: deleteOne,
  updateOne: updateOne,
};
