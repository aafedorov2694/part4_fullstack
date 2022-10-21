const bcrypt = require('bcrypt')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('../utils/user_helper')


describe('when there is initially one user in db', () => {
	beforeEach(async () => {
		await User.deleteMany({})
		const passwordHash = await bcrypt.hash('sekret', 10)
		const user = new User({ username: 'root', passwordHash })
		
		await user.save()
	})

	test('creation succeeds with a fresh username', async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			username: 'mluukkai',
			name: 'Matti Luukkainen',
			password: 'salainen',
		}

		await api
			.post('/api/users')
			.send(newUser)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

		const usernames = usersAtEnd.map(u => u.username)
		expect(usernames).toContain(newUser.username)
	})

	test('user should not be created with a password shorter then 3 symbols', async() => {
		const usersAtStart = await helper.usersInDb()
		console.log('users at start: ', usersAtStart)
		const newUser = {
			username: 'mluukkai',
			name: 'Matti Luukkainen',
			password: 'sa',
		}

		const response = await api.post('/api/users').send(newUser)
			

		const usersAtEnd = await helper.usersInDb()
		console.log('users at end: ', usersAtEnd)

		expect(response.status).toBe(400)
		expect(response.text).toContain('too short')
		expect(usersAtEnd).toHaveLength(usersAtStart.length)

	})

	test('username should be unique', async() => {
		const usersAtStart = await helper.usersInDb()
		const newUser = {
			username: 'root',
			name: 'Matti Luukkainen',
			password: 'salainen',
		}

		const response = await api.post('/api/users').send(newUser)
			

		const usersAtEnd = await helper.usersInDb()
		console.log('users at end: ', usersAtEnd)

		expect(response.status).toBe(400)
		expect(response.text).toContain('Username is not unique')
		expect(usersAtEnd).toHaveLength(usersAtStart.length)
	})
})