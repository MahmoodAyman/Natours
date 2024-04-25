// const fs = require('fs');

const Tour = require('./../models/tourModel');

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8'));


// function to check id instead of repeating yourself but not with MongoDB

// exports.checkID = (req, res, next, val) => {
//   if (val * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'No tours with this ID found'
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   const tour = req.body;
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'No Name or Price'
//     });
//   }
//   console.log(tour);
//   console.log('hello from checkBody');
//
//   next();
// };

exports.getAllTours = async (request, response) => {
  try {
    // console.log(request.query);

    /* 1) Filtering */
    // const tours = await Tour.find({
    //   duration : 5,
    //   difficulty : "easy",
    // });

    /* Using Mongoose methods */
    // const tours = await Tour.find()
    //   .where('duration').equals(request.query.duration)
    //   .where('difficulty').equals(request.query.difficulty);
    const queryObj = { ...request.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(element => delete queryObj[element]);
    // console.log(request.query , queryObj);

    /* Advanced Filtering */
    // { difficulty : 'easy , duration : {$gte : 5 } }
    // { difficulty: 'easy', duration : { gte: '5' } }

    // first step - stringify the query
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, matched =>
      // callback function to return new string
      `$${matched}`);

    // console.log(JSON.parse(queryStr));

    let query = Tour.find(JSON.parse(queryStr));
    // Sorting
    if (request.query.sort) {
      query = query.sort(request.query.sort);
    }

    /* Pagination */
    // define by default number of results in a page
    const page = request.query.page * 1 || 1; // to convert string to number or choose default page 1
    const limit = request.query.limit * 1 || 100;
    const skipValues = ((page - 1) * limit) ;

    query = query.skip(skipValues).limit(limit);
    // throw error when user access not exist page
    if(request.query.page){
      // return a promise contains number of documents in the collection
      const numTours = await Tour.countDocuments();
      if(skipValues >= numTours) throw new Error('This page does not Exist !!!');
    }

    // the response
    const  tours = await query;
    response.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    });
  } catch {
    response.status(400).json({
      status: 'fail',
      message: 'No Tours Found'
    });
  }
};
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