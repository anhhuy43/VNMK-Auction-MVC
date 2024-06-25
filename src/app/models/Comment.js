const mongoose = require('mongoose')
const Schema = mongoose.Schema; 
const slug = require('mongoose-slug-updater')

mongoose.plugin(slug);

const Comment = new Schema({
  postId: { type: String, maxLength: 255 },
  userId: { type: String, maxLength: 255 },
  contentBid: { type: String, maxLength: 600 },
  createAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', Comment)
