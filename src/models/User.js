const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
    },
    name: {
      first: { type: String, required: true },
      last: { type: String, required: true },
    },
    age: Number,
    email: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = { User };
