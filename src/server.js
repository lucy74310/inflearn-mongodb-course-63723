const express = require("express");
const app = express();
const { userRouter } = require("./routes/userRoute");
const mongoose = require("mongoose");

const MONGO_URI =
  "mongodb+srv://bgjo:test1234!!@mongodbtutorial.s3tff.mongodb.net/BlogService?retryWrites=true&w=majority";

const server = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }); // Promise 로 통신
    mongoose.set("debug", true);
    //mongobConnection.then((result) => console.log({ result }));

    console.log("MongoDB connected");

    app.use(express.json()); // JSON.parse 미들웨어 추가
    app.use("/user", userRouter);
    app.listen(3000, () => console.log("server listening on port 3000"));
  } catch (err) {
    console.log(err);
  }
};

server();
