const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const mongoose = require('mongoose')

/* usersRouter.post('/', async (request, response) => {
	await User
		.find({})
		
})
 */
usersRouter.get('/', async(request, response, next) => {
	const users = await User.find({})
	console.log('mongoose: ', mongoose.Schema.Types.ObjectId)
	try{
		if(users){
			response.status(200).json(users)
		} else {
			response.status(400).json({ error: 'Did not manage to get users' })
		}

	} catch (exception) {
		next(exception)
	}
})

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
	console.log('user: ', username, name, password, passwordHash)
	const usernames = await (await User.find({})).map(e => e.username)
	const user = new User({
		username,
		name,
		passwordHash,
	})
	console.log('user: ', user)
	try{
		if(password.length > 2){
			if(!usernames.includes(username)){
				const savedUser = await (await user.populate('blogs')).save()
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