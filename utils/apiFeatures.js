// refactoring getAllTour function using classes
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // create one method for each functionality :
  // 1) Filter
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(element => delete queryObj[element]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, matched =>
      `$${matched}`);
    this.query.find(JSON.parse(queryStr));
    return this;
  }

  // sorting
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt'); // default sorting settings
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1; // to convert string to number or choose default page 1
    const limit = this.queryString.limit * 1 || 100;
    const skipValues = ((page - 1) * limit);
    this.query = this.query.skip(skipValues).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;

/* this is the getAllTour function before refactoring in case you forget */

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
// const queryObj = { ...request.query };
// const excludedFields = ['page', 'sort', 'limit', 'fields'];
// excludedFields.forEach(element => delete queryObj[element]);
// // console.log(request.query , queryObj);
//
// /* Advanced Filtering */
// // { difficulty : 'easy , duration : {$gte : 5 } }
// // { difficulty: 'easy', duration : { gte: '5' } }
//
// // first step - stringify the query
// let queryStr = JSON.stringify(queryObj);
// queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, matched =>
//   // callback function to return new string
//   `$${matched}`);
//
// // console.log(JSON.parse(queryStr));
//
// let query = Tour.find(JSON.parse(queryStr));


// Sorting
// if (request.query.sort) {
//   const sortBy = request.query.sort.split(',').join(' ');
//   query = query.sort(sortBy);
// }else{
//   query = query.sort('-createdAt'); // default sorting settings
// }
/*Field Limiting*/
// if(request.query.fields){
//   const fields = request.query.fields.split(',').join(' ');
//   query = query.select(fields);
// }else{
//   query = query.select('__v');
// }
/* Pagination */
// define by default number of results in a page
// const page = request.query.page * 1 || 1; // to convert string to number or choose default page 1
// const limit = request.query.limit * 1 || 100;
// const skipValues = ((page - 1) * limit);
//
// query = query.skip(skipValues).limit(limit);
// // throw error when user access not exist page
// if (request.query.page) {
//   // return a promise contains number of documents in the collection
//   const numTours = await Tour.countDocuments();
//   if (skipValues >= numTours) throw new Error('This page does not Exist !!!');
// }