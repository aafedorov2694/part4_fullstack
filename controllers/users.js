const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
	const { username, name, password } = request.body
	const saltRounds = 10
	const passwordHash = await bcrypt.hash(password, saltRounds)
	console.log('user: ', username, name, password)
	const user = new User({
		username,
		name,
		passwordHash,
	})
	if(username.length < 3 || password.length < 3){
		response.status(400).json({ error: 'Username and password should be at least 3 characters long' })
	} else {
		const savedUser = await user.save()
		response.status(201).json(savedUser)
	}
	

	
})

module.exports = usersRouter