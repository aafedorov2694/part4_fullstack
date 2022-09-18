//const express = require('express')
const app = require('./app');
const cors = require('cors')
const logger = require('./utils/logger')
const config = require('./utils/config')
const http = require('http')
const Blog = require('./models/blog');


//const blogRouter = require('express').Router()

//app.use('/api/blogs/', blogRouter);




/* app.use(cors())
app.use(express.json()) */



/* app.get('/api/blogs/', (request, response) => {
    logger.info('tychepes')
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
      
    })
})

app.get('/api/blogs/:id', (request, response) => {
    Blog.findById(request.params.id)
        .then( blog => {
            if(blog){
                response.json(blog)
            } else {
                response.status(404).end
            }
        }
        )
        .catch(error => logger.error(error))
        
})

app.post('/api/blogs/', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})
 */

const server = http.createServer(app);

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
logger.info('blogrouter: ', JSON.stringify(app))
