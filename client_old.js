console.log("client code running.123");
const axios = require("axios");

const URI = "http://localhost:3000";

const test = async () => {
  console.time("loading time");
  let {
    data: { blogs },
  } = await axios.get(`${URI}/blog`);

  // console.log(blogs.length, blogs[0]);

  blogs = await Promise.all(
    blogs.map(async (blog) => {
      // async를 달면 promise가 리턴이 됨...
      // Promise all 은 promise의 배열을 받음

      const [res1, res2] = await Promise.all([
        axios.get(`${URI}/user/${blog.user}`),
        axios.get(`${URI}/blog/${blog._id}/comment`),
      ]); // axios 는 Promise 를 리턴한다.
      // 배열 destructuring

      blog.user = res1.data.user;
      blog.comments = await Promise.all(
        res2.data.comments.map(async (comment) => {
          const {
            data: { user }, // destructuring
          } = await axios.get(`${URI}/user/${comment.user}`);
          comment.user = user;
          return comment;
        })
      ); // comments의 유저를 비동기적으로 불러오기
      return blog;
    })
  );

  // console.log(blogs[0]); // console.log 하면 3~4번째 뎁스부터는 그냥 [Object]로 보여준다. 그래서 console.dir을 쓴다.
  // console.dir(blogs[0], { depth: 10 });
  console.timeEnd("loading time");
};

// test();

const testGroup = async () => {
  await test();
  await test();
  await test();
};

testGroup();
