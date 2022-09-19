const logger = require('../utils/logger')
const Blog = require('../models/blog')
const blogRouter = require('express').Router()
const listHelper = require('../utils/list_helper')


blogRouter.get('/', (request, response) => {
	Blog
		.find({})
		.then(blogs => {
			response.json(blogs)
			logger.info(blogs)
			listHelper.dummy(blogs)
		})
		.catch(error => logger.error(error))
})

blogRouter.get('/:id', (request, response) => {
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

blogRouter.post('/', (request, response) => {
	const blog = new Blog(request.body)

	blog
		.save()
		.then(result => {
			response.status(201).json(result)
		})
})


module.exports = blogRouter