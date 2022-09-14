const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const { response } = require('express')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})
const Blog = mongoose.model('Blog', blogSchema)

const mongoUrl = 'mongodb+srv://troktosha:ru024300446@cluster0.zudyj1s.mongodb.net/bloglist?retryWrites=true&w=majority '
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())

app.get('/api/blogs', (request, response) => {
    console.log('datyohuel')
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
      console.log(blogs)
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
        .catch(error => (error))
        
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

blogSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})



const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})