const addSum = (a, b, callback) => {
  setTimeout(() => {
    if (typeof a !== "number" || typeof b !== "number")
      return callback("a,b must be numbers");
    callback(undefined, a + b);
  }, 3000);
};

// 계속 nesting 되면? 긴 로직이 들어가게 되면? 헷갈리게됨 -> promise는 어떻게?
addSum(10, 20, (error, sum) => {
  if (error) return console.log({ error });
  console.log({ sum });
  addSum(sum, 15, (error2, sum2) => {
    if (error2) return console.log({ error2 });
    console.log({ sum2 });
  });
});
