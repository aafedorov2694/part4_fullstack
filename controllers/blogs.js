const logger = require('../utils/logger')
const Blog = require('../models/blog')
const User = require('../models/user')
const blogRouter = require('express').Router()
const listHelper = require('../utils/list_helper')
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

blogRouter.post('/', async (request, response) => {
	const user = (await User.find({}))[0]
	
	const body = request.body
	logger.info('user in blog: ', user)
	let updatedbody = ''
	if(body.likes === undefined){
		body.likes = 0
		updatedbody = body
		
	} else (
		updatedbody = request.body
	)
	
	const blog = new Blog(updatedbody)
	logger.info('blog: ', blog)
	user.blogs = user.blogs.concat(blog._id)
	
	await user.save()
	
	const populating  = await blog.populate('user')
	
	console.log('populating: ', populating)

	 /* try{
		if(populating.title === undefined && populating.url === undefined){
			response.status(400).send({ message: 'BadRequest' })
		} else {
			await populating.save()
			response.status(201).json(populating)
			logger.info(populating)
		}	
	} catch(exception) {
		next(exception)
	} */
}
)


blogRouter.delete('/:id', async (request, response) => {
	
	const idToDelete = request.params.id
	console.log('idTOdelete: ', idToDelete)
	const blogToDelete =  await Blog.findByIdAndRemove(idToDelete)
	if(blogToDelete){
		response.status(200).end()
		console.log('deleted')

	}else{
		response.status(404).send('smth went wrong')
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