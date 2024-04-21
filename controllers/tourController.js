const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8'));

// function to check id instead of repeating yourself
exports.checkID = (req, res, next, val) => {
  if (val * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'No tours with this ID found'
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  const tour = req.body;
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'No Name or Price'
    });
  }
  console.log(tour);
  console.log('hello from checkBody');

  next();
};

exports.getAllTours = (request, response) => {
  console.log(request.requestTime);
  response.status(200).json({
    status: 'success',
    requestDate: request.requestTime,
    results: tours.length,
    data: {
      tours
    }
  });
};
exports.createTour = (request, response) => {
  // console.log(request.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign(
    {
      id: newId
    },
    request.body);
  tours.push(newTour);
  fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    if (err) throw err;
    response.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });

  });
};

// function to get a tour with id
exports.getTour = (request, response) => {
  const id = request.params.id * 1;
  const tour = tours.find(element => element.id === id);
  response.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
};

// function to update data of tour
exports.updateTour = (request, response) => {
  const id = request.params.id * 1;
  const tour = tours.find(element => element.id === id);
  return response.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>'
    }
  });

};

// function to delete tour
exports.deleteTour = (request, response) => {
  const id = request.params.id * 1;
  const tour = tours.find(element => element.id === id);
  return response.status(204).json({
    status: 'success',
    data: {
      tour: null
    }
  });
};



