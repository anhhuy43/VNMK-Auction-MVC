const Post = require("../models/Post");
const Comment = require("../models/Comment");
const User = require("../models/User");
const { mongooseToObject } = require("../../util/mongoose");
const { multipleMongooseToObject } = require("../../util/mongoose");
const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.extend(timezone);

class PostController {
  // /post/:slug
  async show(req, res, next) {
    try {
      const postDetail = await Post.findOne({ slug: req.params.slug }).then(
        (post) => {
          return mongooseToObject(post);
        }
      );

      const commentDetail = await Comment.find({ postId: postDetail._id }).then(
        (comment) => {
          return multipleMongooseToObject(comment);
        }
      );

      const commentdetail1 = await Comment.find({ postId: postDetail._id });
      console.log(
        "🚀 ~ PostController ~ show ~ commentdetail1:",
        commentdetail1
      );
      console.log(
        "🚀 ~ PostController ~ show ~ commentDetail:",
        commentDetail.length
      );

      function getContentbid(myArray) {
        const arr = [];
        for (let i = 0; i < myArray.length; i++) {
          arr.push(Number(myArray[i].contentBid));
        }
        return arr;
      }
      const resultContentBid = getContentbid(commentDetail);
      let bidValueArr = Object.values(resultContentBid);
      let topBidValue = Math.max(...resultContentBid);
      console.log("resultObject", topBidValue);

      const userDetailInCommentPromise = commentDetail.map(async (comment) => {
        const user = await User.findOne({ _id: comment.userId });

        return {
          ...comment,
          user: mongooseToObject(user),
        };
      });
      const userDetailInComment = await Promise.all(userDetailInCommentPromise);

      const endTime = dayjs(postDetail.startTime).add(
        Number(postDetail.duration),
        "m"
      );

      const isBefore = dayjs().isBefore(dayjs(postDetail.startTime));
      const isAfter = dayjs().isAfter(dayjs(endTime));
      const isBetween = !isBefore && !isAfter;
      const countdownTime = Math.abs(dayjs().diff(endTime, "s"));
      const remainingTimeStart = dayjs().diff(postDetail.startTime, "s");
      console.log(
        "starttime",
        dayjs(postDetail.startTime).format("YYYY-MM-DD HH:mm:ss")
      );
      console.log("endtime", dayjs(endTime).format("YYYY-MM-DD HH:mm:ss"));

      res.render("posts/show", {
        post: postDetail,
        comment: userDetailInComment,
        isBefore,
        isAfter,
        isBetween,
        countdownTime,
        remainingTimeStart,
        topBidValue,
      });
    } catch (err) {
      next();
    }
  }

  // [POST] /posts/comment
  comment(req, res, next) {
    const formData = req.body;

    const { slug, ...rest } = formData;

    const payload = { ...rest, userId: req.tokenInfo.userId };

    const comments = new Comment(payload);
    comments
      .save()
      .then(() => res.redirect(`/posts/${slug}`))
      .catch(next);
  }

  // [GET] /posts/create
  create(req, res, next) {
    res.render("posts/create", {
      hoursList: Array(24)
        .fill(null)
        .map((_, i) => i + 1),
    });
  }

  //[POST] /post/store
  store(req, res, next) {
    const formData = req.body;

    const startTime = dayjs(
      `${formData.date} ${formData.time}`,
      "YYYY-MM-DD HH:mm"
    ).toISOString();

    const formData1 = {
      name: formData.name,
      description: formData.description,
      image1: formData.image1,
      image2: formData.image2,
      image3: formData.image3,
      image4: formData.image4,
      image5: formData.image5,
      startTime: startTime,
      duration: formData.duration,
      userId: req.tokenInfo.userId,
    };

    if (req.file) {
      formData1.image6 = req.file.path;
    }
    const posts = new Post(formData1);
    posts
      .save()
      .then(() => res.redirect("/"))
      .catch(next);
  }

  // [GET] /posts/edit
  edit(req, res, next) {
    Post.findById(req.params.id)
      .then((post) =>
        res.render("posts/edit", {
          post: mongooseToObject(post),
        })
      )
      .catch(next);
  }

  // [PUT] /posts/:id
  update(req, res, next) {
    Post.updateOne({ _id: req.params.id }, req.body)
      .then(() => res.redirect("/me/stored/posts"))
      .catch(next);
  }

  // [DELETE] /posts/:id
  delete(req, res, next) {
    Post.deleteOne({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }

  async search(req, res, next) {
    try {
      let searchTerm = req.body.searchTerm
      const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

      const data = await Post.find({
        $or: [
          { name: { $regex: new RegExp(searchNoSpecialChar, 'i')} },
        ]
      })
      console.log("🚀 ~ PostController ~ search ~ data:", data)
      
      res.render('posts/search', {
        data: multipleMongooseToObject(data)
      })
    } catch (err) {
      next()
    }
  }
}

module.exports = new PostController();
