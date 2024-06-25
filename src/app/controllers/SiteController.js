const Post = require("../models/Post");
const { multipleMongooseToObject } = require("../../util/mongoose");

class SiteController {
  index(req, res, next) {
    Post.find({})
      .then((posts) => {
        res.render("home", {
          posts: multipleMongooseToObject(posts),
        });
      })
      .catch(next);
  }
  delete(req, res, next) {
    Post.deleteOne({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }
}

module.exports = new SiteController();
