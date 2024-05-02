const mongoose = require('mongoose');
const slugify = require('slugify');
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true
  },
  slug: String,
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
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is easy , medium, or difficult'
    }
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0']
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function(val) {
        return this.price > val;
      },
      message: 'discount Price must be below Regular price'
    }
  },
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
  images: [String],
  startDates: [Date],
  secretTour: {
    type: Boolean,
    default: false
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


// virtual properties :  fields defined to schema but not persisted (not be saved into database) in order to save space
// fields to convert or calculated data
// can't use it in query because this actually not part of database
tourSchema.virtual('durationWeeks').get(function() {
  // regular function and not an arrow function because we want this keyword to point to current document
  return this.duration / 7; // calculate days and convert it into weeks
});

// Document middleware : runs before.save() and .create
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// executed after all middleware function executed
tourSchema.post('save', function(doc, next) {
  console.log(doc);
  next();
});

// Query Middleware
// see tours for VIP Users
// any query begin with find : find , findOne , findOneAndDelete ....
// to prevent secret Tours from displayed in any query
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function(docs, next) {
  // console.log(`Query took ${Date.now() - this.start} MS`);
  console.log(docs);
  next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
