const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('./utils/logger')
const config = require('./utils/config')
const Blog = require('./models/blog')
const blogRouter = require('./controllers/blogs')
const mongoose = require('mongoose')
const middleware = require('./utils/middlewear')


mongoose.connect(config.MONGODB_URI)
  .then(() => logger.info('Connected to MongoDB'))
  .catch((error) => logger.error(error) )

app.use(cors())
app.use(express.json())

app.use(middleware.requestLogger)


app.use('/api/blogs', blogRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)





module.exports = app