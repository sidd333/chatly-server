const { mongoose, Schema } = require("mongoose");

const UserSchema = new Schema({
  name: String,
  email: { type: String, required: true },
  password: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

// helper functions
UserSchema.statics.findByEmail = async ({ email }) => {
  const checkUserByEmail = await User.findOne({ email });

  if (checkUserByEmail) {
    throw new Error("User Already Exists !!");
  }

  return false;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
