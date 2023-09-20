import mongoose from "mongoose";

 const connectToMongo = () => {
   
    mongoose.connect(process.env.URI);
  console.log("Connected to Mongoodb");
};


export default connectToMongo;
