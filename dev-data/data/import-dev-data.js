const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/../../.env` });
const Tour = require(`${__dirname}/../../models/tourModel`);
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf8'));
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(() => console.log(`DB Connected successfully.`));


// import data into database
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log(`data successfully loaded!`);
    process.exit();
  } catch (err) {

  }
};


// delete all data of tours in database

const deleteData = async () => {
  try {
    await Tour.deleteMany({});
    console.log('Data Successfully deleted!');
    process.exit();
  } catch (err) {
    console.log(`some error ${err}`);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
