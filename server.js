const mongoose = require('mongoose');
const app = require('./app');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(() => console.log(`DB Connected successfully.`));


//create Schema


const port = process.env.port;

app.listen(port, () => console.log(`Listening on port http://127.0.0.1:${port}`));

