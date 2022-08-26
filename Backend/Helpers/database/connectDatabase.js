const mongoose = require('mongoose');

const connectDatabase = async() => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017', {useNewUrlParser: true});
  console.log('MongoDB Connection Successfully');
};

module.exports = connectDatabase;
