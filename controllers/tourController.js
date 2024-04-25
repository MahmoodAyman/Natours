const Tour = require('./../models/tourModel');

const APIFeatures = require('./../utils/apiFeatures');

exports.aliasTopTours = (request, response, next) => {
  request.query.limit = 5;
  request.query.sort = '-ratingsAverage,price';
  request.query.fields = 'name,price,ratingsAverage,difficulty';
  next();
};

exports.getAllTours = async (request, response) => {
  try {
    // the response

    // API

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
  } catch (err) {
    console.log(request.query);
    response.status(400).json({
      status: 'fail',
      message: err
    });
  }
};


// use class


exports.createTour = async (request, response) => {
  try {
    const newTour = await Tour.create(request.body);
    response.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (error) {
    response.status(400).json({
      status: 'fail',
      message: error
    });
  }
};
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
exports.getTour = async (request, response) => {
  const tourID = request.params.id;
  const tours = await Tour.findById(tourID);
  try {
    response.status(200).json({
      status: 'success',
      data: {
        tours
      }
    });
  } catch {
    response.status(400).json({
      status: 'fail',
      message: 'No tours found with this ID'
    });
  }
};

// function to update data of tour
exports.updateTour = async (request, response) => {
  try {
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
  } catch (err) {
    response.status(400).json({
      status: 'fail',
      message: err
    });
  }

};

// function to delete tour
exports.deleteTour = async (request, response) => {
  try {
    const tour = await Tour.findByIdAndDelete(request.params.id);
    response.status(204).json({
      status: 'success'
    });
  } catch (err) {
    response.status(400).json({
      status: 'fail',
      message: err
    });
  }
};