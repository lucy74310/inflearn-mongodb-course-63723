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

# CRUD 중 Read

- 퍼포먼스에 큰 영향.
  비효율적 vs prod에서 사용하기 좋은 vs 몽고db스러운 방법
  3개의 컬랙션
- 성능측정

```
[1번방법 - 클라이언트에서 계속 호출]
blogLimit 10 : 5초
blogLimit 20 : 10초
blogLimit 50 : 30초
commentLimit 5 + blogsLimit 20 : 2초
commentLimit 1 + blogsLimit 20 : 1초

[2번방법 - 백엔드api에서 populate틍해 가져온다]
blogLimit 20 : 1초
blogLimit 50 : 2초
blogLimit 200 : 5초

[3번방법 - embed 시킨다]
blogLimit 20 : 0.1초대
blogLimit 50 : 0.4초대
blogLimit 200 : 0.9초대
```

## 1. 비효율적인 방법

client.js 참고

1. 블로그를 가져온다. -> GET:/blog :: 1번호출 (블로그 10개 가져옴)
2. 블로그의 유저와 후기를 세팅한다. -> 유저랑 후기를 각각 블로그 10개에 대해 -> GET:/blog/{{id}}/comment x 10 , GET:/user/{{id}} x 10 :: 여기까지 21번의 호출
3. 후기에 유저를 세팅한다. -> 커멘트 M개 만큼 GET:/user/{{id}} 호출
   블로그 수 X 후기 수 만큼호출 + 21 번 ...

```
클라이언트. 자바스크립트에서 돌아가는 코드이다.

그나마 Promise.all 로 묶어서 한번에 병렬로 호출했지만...

총 (1 + N) + N x M (N : 블로그수, M :블로그당 후기수)
지금 블로그 10개고, 블로그당 후기 10개 ->  121번 호출

-> 운영에선 적합하지 않은 구조
-> 최대한 백엔드 API를 적게 불러와야 한다.

```

현재 구조의 시간을 구해보자.

```
console.time('loading time');
console.timeEnd('loading time');
하면 실행시간..구할수 있다.

blogLimit 10 : 5초
blogLimit 20 : 10초
blogLimit 50 : 30초
commentLimit 5 + blogsLimit 20 : 2초
commentLimit 1 + blogsLimit 20 : 1초

```

- 200ms 가 이상적이고, 1초가 넘어가는건 안된다.
- N+1 Problem

**Promise.all로 묶는다 해도 최소 3번은 그런 묶여진 Promise.all을 호출해야 한다.
DB호출 너무 많다**

## 2. populate 사용한 방법

- 기존 api를 개선한다
  get:/blog 를 호출하면 client에서 하던 처리를 다 backend 에서 해준다 .
- 그렇게 해도 여전히 통신이 너무 많다.
- 그 다음단계 ...

1. blog가져올때 user를 가져오도록 populate([{path: "user"}]) 추가함.

```
const blogs = await Blog.find({})
      .limit(20)
      .populate([{ path: "user" }]);
```

2. blog 가져올때 comment 도 가져오려면?
   지금 blogShema는 comment를 들고있지 않다. commentShema가 갖고 있음
   그럼 BlogShema에 가상의 comment 필드 추가

```
BlogSchema.virtual("comments", {
  ref: "comment",
  localField: "_id",
  foreignField: "blog",
});

BlogSchema.set("toObject", { virtuals: true });
BlogSchema.set("toJSON", { virtuals: true });
```

** 1번의 요청으로 다 가져오는 방법! 바로 내장하는 방법..embed.. **

## 3. 문서내장으로 읽기 퍼포먼스 극대화 (denormalize) -> 몽고db스러운 방법

- 자식 문서를 부모 문서에 아예 내장해버리는거
- blog 읽어서 바로 리턴!
- 장점: 간소, 속도 빠름
- 단점: cud 작업이 늘어남. comment 생성시 blog 에 추가, 유저도 추가

**쓰기비용이 좀 발생하더라도, 읽기가 훨씬 빈번하다.**

### POST API에 적용해보장

- blog안에 user를 내장할거고,
- comment도 내장할거고
- comment안에 user 내장할거다.

1. Blog에 user 내장하기
   BlogShema 가서 ..
   필요한 항목만 내장

```
user: {
      _id: { type: Types.ObjectId, required: true, ref: "user" },
      username: { tpye: String, required: true },
      name: {
        first: { type: String, required: true },
        last: { type: String, required: true },
      },
    },
```

- 위처럼 바꿔주면 POST:/blog API 딱히 더 무거워지지않고 수정 완료.

2. 후기 추가

- 가상데이터 주석처리
- commentSchema 를 import해와서 통째로 내장하기 (blog 정보 중복되는데 일단 이런방법도 있음)
- blog API 는 수정할 필요 X
- POST:/blog/{{id}}/comment API 수정 : 후기를 생성할때 blog에도 같이 업데이트 해줘야 한다.

```
// blogSchema에 추가
comments: [CommentSchema],

// commentRoute에
await Promise.all([
  comment.save(),
  Blog.updateOne({ _id: blogId }, { $push: { comments: comment } }), // comments 키에 comment를 더해줄거임.
]);

```

3. 후기에 유저 추가

- 후기 생성할때 userFullName 부분 추가해주기.

```
// commentSchema
user: { type: ObjectId, required: true, ref: "user" },
userFullName: { type: String, required: true},

// commentRoute
const comment = new Comment({
  content,
  user,
  userFullName: `${user.name.first} ${user.name.last}`,
  blog,
});
```

#### 후기 수정 : blog.comments.$.content 수정

내장된 객체가 배열일때 option이 충족된 배열만 정보 바꾸기

```
Blog.updateOne(
    { "comments._id": commentId }, // option
    { "comments.$.content": content }
)
```

### 유저의 이름을 바꾸면, User의 user.name과 blog안의 user.name 데이터와 blog안의 comments 배열중 해당하는 user가 있으면 그 유저의 userFullName 수정

#### 내장된 객체가 객체일때 User 정보 바꾸기

- user
- blog의 유저

```
await Blog.updateMany({ "user._id": userId }, { "user.name": name });
```

- comment 안의 유저도 바꿔야한다.

```
await Blog.udateMany(
        {},
        { "comments.$[element].userFullName": `${name.first} ${name.last}` }, // element는 comment객체 그 자체
        { arrayFilters: [{ "element.user._id": userId }] } // 위 element 중 이거에 해당되는 것만 처리를 해준다.
      );
```

4. Comment Delete 하기

- 블로그에서 해당 커멘트 삭제하기

```
$push가 배열에 넣어주는 거였다면
$pull은 제거해주는거

await Blog.updateOne(
    { "comments._id": commentId },
    { $pull: { comments: { _id: commentId } } }
    // { $pull: { comments: { content: "hello", state: true } } }  _id가 아니고 content와 state라는게 true일때 -> 둘중에 하나만 충족되도 pull 된다.
    // 둘다 충족될때 삭제하고 싶다면 $elemMatch 쓴다.
    // { $pull: { comments: { $elemMatch: { content: "hello", state: true } } } }
  );

```

5. User 삭제하기

유저가 쓴 블로그도 삭제
유저가 쓴 커멘트도 삭제
커멘트 삭제

```
const [user] = await Promise.all([
      User.findOneAndDelete({ _id: userId }),
      Blog.deleteMany({ "user._id": userId }),
      Blog.updateMany(
        { "comments.user": userId },
        { $pull: { commnets: { user: userId } } }
      ),
      Comment.deleteMany({ user: userId }),
    ]);
```

### 참고

mongoCompass에서 찾을때

- 부정검색

```
{'user._id': {$ne: ObjectId('6186aff7673776024677a9cf')}}
```

- 내장된 객체가 배열일때 그 배열줄 조건충족하는 거 찾을때

```
{ "comments.user" : ObjectId('6186aff7673776024677a9cf')}
```
