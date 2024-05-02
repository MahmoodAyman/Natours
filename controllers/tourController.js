const Tour = require('./../models/tourModel');

const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');

exports.aliasTopTours = (request, response, next) => {
  request.query.limit = 5;
  request.query.sort = '-ratingsAverage,price';
  request.query.fields = 'name,price,ratingsAverage,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (request, response, next) => {
  const features = new APIFeatures(Tour.find(), request.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  // start response
  const tours = await features.query;
  response.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
});


// use class

exports.createTour = catchAsync(async (request, response, next) => {
  const newTour = await Tour.create(request.body);
  response.status(201).json({
    status: 'success',
    data: {
      tour: newTour
    }
  });
});
// exports.createTour = (request, response) => {
//   Tour.create(request.body);
//   // console.log(request.body);
//   // const newId = tours[tours.length - 1].id + 1;
//   const newTour = Object.assign(
//     {
//       // id: newId
//     },
//     request.body);
//   // tours.push(newTour);
//   // fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
//   //   if (err) throw err;
//   //   response.status(201).json({
//   //     status: 'success',
//   //     data: {
//   //       tour: newTour
//   //     }
//   //   });
//   //
//   // });
// };

// function to get a tour with id
exports.getTour = catchAsync(async (request, response, next) => {
  const tourID = request.params.id;
  const tour = await Tour.findById(tourID);
  if (!tour) {
    return next(new AppError('No Tours Found', 404));
  }
  response.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});

// function to update data of tour
exports.updateTour = catchAsync(async (request, response, next) => {
  const newUpdate = await Tour.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    runValidators: true
  });
  response.status(200).json({
    status: 'success',
    data: {
      newUpdate
    }
  });
});


// function to delete tour
exports.deleteTour = catchAsync(async (request, response, next) => {
  const tour = await Tour.findByIdAndDelete(request.params.id);
  if (!tour) {
    return next(new AppError('tour not found', 404));
  }
  response.status(204).json({
    status: 'success'
  });
});


// Aggregation
exports.getTourStats = catchAsync(async (request, response, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: '$difficulty', // everything in one group
        num: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
    // {  you can aggregate after matching
    //   $match: { _id: { $ne: 'easy' } }
    // }
  ]);
  response.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });

});

// get the tours in a specific date
exports.getMonthlyPlan = catchAsync(async (request, response, next) => {
  const year = request.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          // tours between beginning and the end of the year
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numToursStarts: { $sum: 1 },
        tours: { $push: '$name' }

      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { numToursStarts: -1 }
    },
    {
      $limit: 12
    }
  ]);
  response.status(200).json({
    status: 'success',
    results: plan.length,
    data: {
      plan
    }
  });
});