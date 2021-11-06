const { Router } = require("express");
const blogRouter = Router();
const { Blog, User } = require("../models");
const { isValidObjectId } = require("mongoose");

// commentRoute를 blogRoute에 둬도 된다. server.js에 안두고
const { commentRouter } = require("./commentRoute");

blogRouter.use("/:blogId/comment", commentRouter);

blogRouter.post("/", async (req, res) => {
  try {
    const { title, content, islive, userId } = req.body;
    if (typeof title !== "string")
      return res.status(400).send({ err: "title is required" });
    if (typeof content !== "string")
      return res.status(400).send({ err: "content is required" });
    if (islive && typeof islive !== "boolean")
      return res.status(400).send({ err: "islive must be a boolean" });
    if (!isValidObjectId(userId))
      return res.status(400).send({ err: "userId is invalud" });

    let user = await User.findById(userId);
    if (!user) res.status(400).send({ err: "user does not exist" });

    let blog = new Blog({ ...req.body, user: user.toObject() }); // user 자체를 넘겨줘도 알아서 id만 빼올것.. Types.objectId를 정의해놨기 때문에.

    await blog.save();
    return res.send({ blog });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

blogRouter.get("/", async (req, res) => {
  try {
    // const blogs = await Blog.find({}).limit(20);
    // blog의 유저 추가
    const blogs = await Blog.find({}).limit(200);
    // .populate([
    //   { path: "user" },
    //   { path: "comments", populate: { path: "user" } },
    // ]);
    /* 
    mongoose가 내부적으로 해줌. blogs도 한번호출 users 도 한번호출, 그리고 중복은 제거하고 (블로그는 여러개, 같은사람이 쓴) 리턴해줘서 알아서 blogs에 매칭해줌.
    
    path: comments 추가할때 문제점... blogShema에 comment 를 안들고 있당... comment가 부모 id를 가지고 있다. -> 가상의 comment 필드 추가

    comment 가져올때 blog _id를 중복제거하고 가져와줌. 

    이렇게 안하면 441번정도 호출했을 일을 단 3번 db에 접근해서 가져오게 된다. 

    그담.. comment의 유저를 불러오기... 

    populate를 path 안에서 원하는 만큼 해줄수 있다. 

    populate 추가해줬으니 4번의 호출이 있을것... 
    */

    return res.send({ blogs });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

blogRouter.get("/:blogId", async (req, res) => {
  try {
    const { blogId } = req.params;

    if (!isValidObjectId(blogId))
      res.status(400).send({ err: "blogId is invalud" });
    const blog = await Blog.findOne({ _id: blogId });
    return res.send({ blog });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

//전체적으로 수정할때 put
blogRouter.put("/:blogId", async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!isValidObjectId(blogId))
      res.status(400).send({ err: "blogId is invalud" });

    const { title, content } = req.body;
    if (typeof title !== "string")
      res.status(400).send({ err: "title is required" });
    if (typeof content !== "string")
      res.status(400).send({ err: "content is required" });

    const blog = await Blog.findOneAndUpdate(
      { _id: blogId },
      { title, content }, // $set: { content : "123 "} 인데 몽구스가 알아서 해준다.
      { new: true }
    );

    return res.send({ blog });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

// 부분적으로 수정할때 patch 씀
blogRouter.patch("/:blogId/live", async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!isValidObjectId(blogId))
      res.status(400).send({ err: "blogId is invalud" });

    const { islive } = req.body;

    if (typeof islive !== "boolean")
      res.status(400).send({ err: "boolean islive is required" });

    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { islive },
      { new: true }
    );
    return res.send({ blog });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

module.exports = { blogRouter };
