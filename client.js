console.log("client code running.123");
const axios = require("axios");

const URI = "http://localhost:3000";

const test = async () => {
  console.time("loading time");
  let {
    data: { blogs },
  } = await axios.get(`${URI}/blog`);
  // console.dir(blogs[1], { depth: 10 });

  // 한번에 가져오기
  console.timeEnd("loading time");
};

// test();

const testGroup = async () => {
  await test();
  await test();
  await test();
  await test();
  await test();
};

testGroup();
