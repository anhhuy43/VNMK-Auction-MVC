const mongoose = require('mongoose')
const Schema = mongoose.Schema; 
const slug = require('mongoose-slug-updater')

mongoose.plugin(slug);

const Post = new Schema({
  name: { type: String, maxLength: 255 },
  description: { type: String, maxLength: 600 },
  image1: { type: String, maxLength: 255 },
  image2: { type: String, maxLength: 255 },
  image3: { type: String, maxLength: 255 },
  image4: { type: String, maxLength: 255 },
  image5: { type: String, maxLength: 255 },
  startTime: { type: String, maxLength: 255 },
  duration: { type: String, maxLength: 255 },
  slug: { type: String, slug: 'name', unique: true },
  createAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  userId: { type: String, maxLength: 255 },
  image6: { type: String, maxLength: 255 },
});

module.exports = mongoose.model('Post', Post)
