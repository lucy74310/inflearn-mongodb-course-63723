const addSum = (a, b, callback) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (typeof a !== "number" || typeof b !== "number") {
        reject("a,b must be numbers");
      }
      resolve(a + b);
    }, 3000);
  });
};

addSum(10, 12)
  .then((sum1) => addSum(sum1, 10))
  .then((sum2) => addSum(sum2, 10))
  .then((sum3) => addSum(sum3, 10))
  .then((sum4) => addSum(sum4, 10))
  .then((sum5) => console.log({ sum5 }))
  .catch((error) => console.log({ error }));

const totalSum = async () => {
  try {
    let sum = await addSum(10, 10);
    let sum2 = await addSum(sum, 10);
    console.log({ sum, sum2 });
  } catch (err) {
    if (err) console.log({ err });
  }
};

console.log(totalSum());
