const newsRouter = require('./news')
const meRouter = require('./me')

const siteRouter = require('./site')
const userRouter = require('./user')
const postRouter = require('./posts')

function route(app) {

  app.use('/news', newsRouter)
  app.use('/me', meRouter)
  app.use('/user', userRouter)
  app.use('/posts', postRouter)

  app.use('/', siteRouter)
  
}

module.exports = route;

