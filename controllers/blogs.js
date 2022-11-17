const logger = require('../utils/logger')
const Blog = require('../models/blog')
const User = require('../models/user')
const blogRouter = require('express').Router()
const listHelper = require('../utils/list_helper')
const jwt = require('jsonwebtoken')
//const User = require('../models/user')
require('express-async-errors')


blogRouter.get('/', (request, response) => {
	Blog
		.find({})
		.populate('user')
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

blogRouter.post('/', async (request, response, next) => {
	
	console.log('token: ', request.token)
	const body = request.body
	
	const user = request.user
	logger.info('user in blog: ', user)
	
	if(body.likes === undefined){
		body.likes = 0
		body.user = user._id
		
	} else {
		body.user = user._id
	}
	
	const blog = new Blog(body)
	logger.info('blog: ', blog)
	user.blogs = user.blogs.concat(blog._id)
	
	await user.save()
	
	const populating  = await blog.populate('user')
	
	console.log('populating: ', populating)
 
	try{
		if(populating.title === undefined && populating.url === undefined){
			response.status(400).send({ message: 'BadRequest' })
		} else {
			await populating.save()
			response.status(201).json(populating)
			logger.info(populating)
		}	
	} catch(exception) {
		next(exception)
	}
}
)


blogRouter.delete('/:id', async (request, response, next) => {
	const token = request.token
	const idToDelete = request.params.id
	const user = request.user
	console.log('user: ', user)

	
	try{
		const verification = await jwt.verify(token, process.env.SECRET)
		const blog = await Blog.findById(idToDelete)
		const userInBlog = await User.findById(blog.user.toString()) 
		logger.info('user: ', user._id.toString(), 'verification: ', verification.id)
		
		if(user._id.toString() === userInBlog._id.toString()){
			const blogToDelete = await Blog.findByIdAndRemove(idToDelete)
			if(blogToDelete){
				response.status(200).end()
			} else {
				response.status(400).json({ error: 'Blog is not found in the database' })
			}
		
		} else {
			response.status(401).json({ error: 'The user is not authorized to delete a blog, which was created by other user' })
		}
	} catch(ex){
		next(ex)
	}
	
 
	
})

blogRouter.put('/:id', async(request, response) => {
	const id = request.params.id
	const likes = request.query.likes

	await Blog
		.findByIdAndUpdate(id, { likes: likes })
	response.status(204).end()
		
	
})


module.exports = blogRouter