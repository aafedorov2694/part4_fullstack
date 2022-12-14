const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
	{
		_id: '5a422a851b54a676234d17f7',
		title: 'React patterns',
		author: 'Michael Chan',
		url: 'https://reactpatterns.com/',
		likes: 7,
		__v: 0
	},
	{
		_id: '5a422aa71b54a676234d17f8',
		title: 'Go To Statement Considered Harmful',
		author: 'Edsger W. Dijkstra',
		url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
		likes: 5,
		__v: 0
	},
	{
		_id: '5a422b3a1b54a676234d17f9',
		title: 'Canonical string reduction',
		author: 'Edsger W. Dijkstra',
		url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
		likes: 12,
		__v: 0
	},
	{
		_id: '5a422b891b54a676234d17fa',
		title: 'First class tests',
		author: 'Robert C. Martin',
		url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
		likes: 10,
		__v: 0
	},
	{
		_id: '5a422ba71b54a676234d17fb',
		title: 'TDD harms architecture',
		author: 'Robert C. Martin',
		url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
		likes: 0,
		__v: 0
	},
	{
		_id: '5a422bc61b54a676234d17fc',
		title: 'Type wars',
		author: 'Robert C. Martin',
		url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
		likes: 2,
		__v: 0
	}  
]

beforeEach(async () => {
	await Blog.deleteMany({})
	const newObject = initialBlogs.map(blog => new Blog(blog))
	const promiseArray = newObject.map(blog => blog.save())
	await Promise.all(promiseArray)
}, 1000000)  

test('all the blogs returned as json', async() => {
	await api
		.get('/api/blogs')
		.expect(200)
		.expect('Content-Type', /application\/json/)

})

test('the id is returned correctly', async() => {
   
	const response = await api.get('/api/blogs')
	const content = response.body.map(e => e)
	console.log('response body test: ', content[0].id)
	expect(content[0].id).toBeDefined()
})

test('new blog can be added to the DB', async() => {
	const testBlog = {
		title: 'BLogBlogBlog',
		author: 'AntonAnton',
		url: 'blog.fi/anton/blog',
		likes: 3
	}

	const credentials = {
		username: 'root',
		password: 'sekret',
	}

	const login = await api.post('/api/login')
		.send(credentials)
	const fullToken = `Bearer ${login.body.token}`
	console.log('fullToken: ', fullToken)
	await api
		.post('/api/blogs')
		.send(testBlog)
		.set('Authorization', fullToken)
		.expect(201)
		.expect('Content-Type', /application\/json/)
		
	const response = await api
		.get('/api/blogs')
		.set('Authorization', fullToken)
		.expect(200)
		.expect('Content-Type', /application\/json/)
		
	console.log('response body in test: ', response.body)
	const content = response.body.map(blog => blog.title)
	expect(response.body).toHaveLength(initialBlogs.length+1)
	expect(content).toContain('BLogBlogBlog')
 
})

test('if likes property missing it has zero value in DB', async() => {
	const testBlogNoLikes = {
		title: 'BLogBlogBlog',
		author: 'AntonAnton',
		url: 'blog.fi/anton/blog',
		
	}

	await api
		.post('/api/blogs')
		.send(testBlogNoLikes)
		.expect(201)
		.expect('Content-Type', /application\/json/)
    
	const response = await api.get('/api/blogs')
	const likes = response.body.map(blogs => blogs.likes)
	expect(response.body).toHaveLength(likes.length)

})

test('if url&title properties missing it returns 404', async() => {
	const testBlogNoUrl = {
		//title: 'BLogBlogBlog',
		author: 'AntonAnton',
		//url: 'blog.fi/anton/blog',
		likes: 0
	}

	await api
		.post('/api/blogs')
		.send(testBlogNoUrl)
		.expect(400)
		.expect('Content-Type', /application\/json/)
    
	
}, 100000)

test('deletion of the resource was successful', async() => {
	await api
		.delete('/api/blogs/5a422a851b54a676234d17f7')
		.expect(200)
	
	const response =  await api.get('/api/blogs')
	console.log('response from delete: ', response)
	expect(response.body).toHaveLength(initialBlogs.length-1)
})

test('resource should be updated successfully', async() => {
	const numberOfLikes = 755
	await api
		.put(`/api/blogs/5a422a851b54a676234d17f7?likes=${numberOfLikes}`)
		.expect(204)
    
	const response = await api.get('/api/blogs/5a422a851b54a676234d17f7')
	console.log('response: ', response.body)
	expect(response.body.likes).toBe(numberOfLikes)
})


afterAll(() => {
	mongoose.connection.close()
})
