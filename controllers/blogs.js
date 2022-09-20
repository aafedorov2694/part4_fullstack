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

blogRouter.post('/', async (request, response) => {
	
	const body = request.body
	let updatedbody = ''
	if(body.likes === undefined){
		body.likes = 0
		updatedbody = body
	} else (
		updatedbody = request.body
	)
	
	const blog = new Blog(updatedbody)
	
	blog
		.save()
		.then(result => {
			body.title === undefined && body.url === undefined
				? response.status(400).send({ message: 'BadRequest' })
				:
				response.status(201).json(result)
			console.log('result: ', result)
		})
})


module.exports = blogRouter