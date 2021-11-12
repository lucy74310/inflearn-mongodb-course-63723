# inflearn-mongodb-course-63723 목차

Lecture : [몽고디비-기초-실무](https://www.inflearn.com/course/c/dashboard)

## Lectrue Part 1. Mongodb Intro

[MongodbIntro](https://github.com/lucy74310/inflearn-mongodb-course-63723/tree/main/1_MongodbIntro.md)

## Lectrue Part 2~3 Async Programming

[Async Programming](https://github.com/lucy74310/inflearn-mongodb-course-63723/tree/main/2_AsyncProgramming.md)

## Lectrue Part 4 Node.js 로 Mongodb 다루기

[Node.js 로 Mongodb 다루기](https://github.com/lucy74310/inflearn-mongodb-course-63723/tree/main/3_RestfulAPIIntro.md)

## Lectrue Part 5~7. 관계된 데이터 효율적으로 읽기 & 문서내장으로 퍼포먼스 극대화 ~ 문서내장으로 읽기 퍼포먼스 극대화

[관계된 데이터 효율적으로 읽기 & 문서내장으로 퍼포먼스 극대화](https://github.com/lucy74310/inflearn-mongodb-course-63723/tree/main/4_RelatedDataManagingInMongoDB.md)

## Lectrue Part 7 마지막. 스키마 설계

[스키마설계](https://github.com/lucy74310/inflearn-mongodb-course-63723/tree/main/5_SchemaDesign.md)

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

##

처리하는 부분은 간단..
validation 잘 만들어주는게 굉장히 중요
api 주소, url 잘 만들고, post put get delete 잘 지켜주는게 실수를 많이 줄여준다.

client code에서도 input 정보 받을때도 당연히 해야

이중으로 프론트에서도 백에서도 validation 당연히 해야한다.

##

POST:/blog/:blogId/comment
user를 불러오고, blog를 불러오고 순차적으로 할 필요가 없다.

- Promise.all 사용
