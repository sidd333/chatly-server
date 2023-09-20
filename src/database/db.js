const mongoose = require("mongoose");

const connectToMongo = () => {
  mongoose.connect(process.env.URI);
  console.log("Connected to Mongoodb");
};

module.exports = connectToMongo;
