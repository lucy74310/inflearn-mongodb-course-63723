const { Router } = require("express");
const commentRouter = Router({ mergeParams: true }); // server.js에서 받은 :blogId도 받아옴
const { Blog, User, Comment } = require("../models");
const { isValidObjectId } = require("mongoose");
/* 
  /user
  /blog
  (x)/comment -> 후기는 특정블로그의 후기임. 하위개념. 따라서
  (0)/blog/:blogId/comment

*/

commentRouter.post("/", async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!isValidObjectId(blogId))
      return res.status(400).send({ err: "blogId is invalid" });
    const { content, userId } = req.body;
    if (!isValidObjectId(userId))
      return res.status(400).send({ err: "userId is invalid" });
    if (typeof content !== "string")
      return res.status(400).send({ err: "content is required" });

    const [blog, user] = await Promise.all([
      Blog.findById(blogId),
      User.findById(userId),
    ]);

    if (!blog || !user)
      return res.status(400).send({ err: "blog or user does not exist" });
    if (!blog.islive)
      return res.status(400).send({ err: "blog is not available" });
    const comment = new Comment({
      content,
      user,
      userFullName: `${user.name.first} ${user.name.last}`,
      blog,
    });

    // let [comment, blog] = // destructuring 해서 하면 되지만 지금은 x

    await Promise.all([
      comment.save(),
      Blog.updateOne({ _id: blogId }, { $push: { comments: comment } }), // comments 키에 comment를 더해줄거임.
    ]);
    return res.send({ comment });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

commentRouter.get("/", async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!isValidObjectId(blogId))
      return res.status(400).send({ err: "blogId is invalid" });

    // const blog = await Blog.findOne({ blog: blogId });
    // if (!blog) return res.status(400).send({ err: "blog does not exist" });
    // blog id 가 존재하지 않으면 애초에 해당된 코멘트가 x 빈 배열로 return.
    // 괜히 중복적으로 호출할 필요 최소화.

    const comments = await Comment.find({ blog: blogId });
    return res.send({ comments });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

module.exports = { commentRouter };
