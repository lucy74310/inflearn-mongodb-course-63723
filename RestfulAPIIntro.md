# inflearn-mongodb-course-63723 목차

Lecture : [몽고디비-기초-실무](https://www.inflearn.com/course/c/dashboard)

## Lectrue Part 1. Mongodb Intro

[MongodbIntro](https://github.com/lucy74310/inflearn-mongodb-course-63723/tree/main/MongodbIntro.md)

## Lectrue Part 2~3 Async Programming

[Async Programming](https://github.com/lucy74310/inflearn-mongodb-course-63723/tree/main/AsyncProgramming.md)

## Lectrue Part 4 Node.js 로 Mongodb 다루기

[Node.js 로 Mongodb 다루기](https://github.com/lucy74310/inflearn-mongodb-course-63723/tree/main/RestfulAPIIntro.md)

## Lectrue Part 5. 관계된 데이터 효율적으로 읽기

[관계된 데이터 효율적으로 읽기](https://github.com/lucy74310/inflearn-mongodb-course-63723/tree/main/RelatedDataManagingInMongoDB.md)

<hr>
```
npm i mongoose
```

무한로딩..
try
catch로 감싸야 한다.

- destructing

```
let { username, name } = req.body;
        /**
         * let username = req.body.username;
         * let name = req.body.name;
         */
```

한번에 받아오는것

```
const user = await User.findByIdAndUpdate(
          userId,
          { $set: { age } },
          { new: true }
        );
```

new: true 안해주면 업데이트 되기 이전의 데이터를 전달해줌

Tip : 저장할때마다 format 알아서 맞춰주는 기능 > Prettier Install
(vscode : ctrl+ , > editor save > Format on save check)

#### findOne&save 와 findOndAndUpdate의 차이.

findOne 이후 변경사항을 node에서 set해주고 save를 하면 -> 변경된 부분만 바꿔준다.
findOneAndUpdate 는 모두 업데이트

ex] 나이만 바꾼 상황

```
// findOne & save -> save 할때 한번더 mongoose가 validation을 해준다는거
Mongoose: users.updateOne({ _id: new ObjectId("616c43b21f462fcd1fd5f909") }, { '$set': { age: 31, updatedAt: new Date("Sun, 17 Oct 2021 16:18:26 GMT") }}, { session: null })

// findOndAndUpdate
Mongoose: users.findOneAndUpdate({ _id: new ObjectId("616c43b21f462fcd1fd5f909") }, { '$setOnInsert': { createdAt: new Date("Sun, 17 Oct 2021 16:18:56 GMT") }, '$set': { updatedAt: new Date("Sun, 17 Oct 2021 16:18:56 GMT"), name: { first: 'bb', last: 'lucy' }, age: 32 }}, { upsert: false, remove: false, projection: {}, returnDocument: 'after', returnOriginal: false})
```

하지만 2번 왔다갔다보다 1번이 낫다.

만약 저렇게(2번 왔다갔다) 처리해야할 일이 있을때는 저렇게.
