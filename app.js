const express = require('express');

const app = express();


const morgan = require('morgan');
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// create middleware
app.use(express.json());


// middleware to static files
app.use(express.static(`${__dirname}/public`));
// create our middleware function
app.use((request, response, next) => {
  // console.log('Hello from the middleware');
  next();
});

app.use((request, response, next) => {
  request.requestTime = new Date().toISOString();
  next();
});

//---------------Route Handlers for Tours ---------------
// Routes
// --------------- Routes for tours ---------------
app.use('/api/v1/tours', tourRouter);
// --------------- Routes for Users ---------------
app.use('/api/v1/users', userRouter);

// --------------- function to handle all unhandled routes ---------------
app.all('*', (request, response, next) => {
  // const err = new Error(`can't find ${request.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError(`can't find ${request.originalUrl} on this serve` , 404));
});

// --------------- Error Handling middleware ---------------
app.use(globalErrorHandler);

// Server
module.exports = app;

