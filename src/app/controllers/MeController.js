const Post = require("../models/Post");
const { multipleMongooseToObject } = require('../../util/mongoose')


class MeController {
  // [GET] /me/stored/posts
  storedPosts(req, res, next) {
    Post.find({ userId: req.tokenInfo.userId})
      .then(posts => res.render('me/stored-posts',  {
        posts: multipleMongooseToObject(posts)
      }))
      .catch(next)
  }
}

module.exports = new MeController();
