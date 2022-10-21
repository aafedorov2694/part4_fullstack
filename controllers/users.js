const bcrypt = require('bcrypt')
const { request } = require('../app')
const blog = require('../models/blog')
const usersRouter = require('express').Router()
const User = require('../models/user')

/* usersRouter.post('/', async (request, response) => {
	await User
		.find({})
		
})
 */

usersRouter.delete('/', async(request, response, next) => {
	const deletion = await User.deleteMany({})
	try{
		if(deletion.acknowledged === true) {
			response.status(201).end()
		} else {
			response.status(400).json({ error: 'Something went wrong' })
		}
	} catch(error){
		next(error)
	}
	console.log('deletion: ', deletion)
})
usersRouter.post('/', async (request, response, next) => {
	const { username, name, password } = request.body
	const saltRounds = 10
	const passwordHash = await bcrypt.hash(password, saltRounds)
	console.log('user: ', username, name, password)
	const usernames = await (await User.find({})).map(e => e.username)
	const user = new User({
		username,
		name,
		passwordHash,
	})

	try{
		if(password.length > 2){
			if(!usernames.includes(username)){
				const savedUser = await user.save()
				response.status(201).json(savedUser)
			} else{
				response.status(400).json({ error: 'Username is not unique' })
			}
		
		} else {
			response.status(400).json({ error: 'Password is too short' })
		}
		
		
	} catch (error) {
		next(error)
	}
	
} 
)

module.exports = usersRouter