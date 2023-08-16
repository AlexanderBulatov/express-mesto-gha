const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const router = require('./routes/index');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  // useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
}).then(() => {
});

// const a = {};
// a.b = {
//   someKey: 'ddddd',
// };
// console.log(a);

app.use((req, res, next) => {
  req.user = {
    _id: '64db97f76d5936109f5b666d', // id hard coding
  };
  next();
});

app.use('/', router);

app.listen(PORT, () => {});
