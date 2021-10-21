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
