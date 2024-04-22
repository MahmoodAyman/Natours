const mongoose = require('mongoose');
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a max group size']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty']
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,// remove all white strings in the beginning and end of the string
    required: [true, 'A tour must have a description'] // because it will be displayed on overview page
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,// leave the image in the file system and just use the name of it
    required: [true, 'A tour must have an image']
  },
  images: { // images for guids and other staff
    type: [String],
    createdAt: {
      type: Date,
      default: Date.now()
    },
    startDates: [Date]
  }
});
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
// const testTour = new tourModel({
//   name: 'The Forest Hiker',
//   rating: 4.7,
//   price: 497,
//   description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
//   image: 'tour-1-cover.jpg'
// });
//
// testTour.save().then(doc =>{
//   console.log(doc);
// }).catch(err=>{
//   console.log(`Error ${err}`);
// })
