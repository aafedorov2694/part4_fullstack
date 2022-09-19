var _ = require('lodash')

const dummy = (blogs) => {
	if(blogs){
		return 1
	}
}

const totalLikes = (blogs) => {
	let likesSum = 0
    
	if(blogs.length === 1){
		likesSum = blogs[0].likes
	} else if(blogs.length > 1) {
		blogs.forEach( e => {
			likesSum += e.likes
            
		})
	} else if(blogs.length === 0) {
		likesSum === 0
	}
	return likesSum
		
}

const favoriteBlog = (blogs) => {
	let favorite = 0
	let chosenId = 0
	let winner = 0

	blogs.forEach(e => {
		if(e.likes > favorite) {
			favorite = e.likes
			chosenId = e._id
		}
	})
	blogs.forEach(e => {
		e._id === chosenId ? winner = e : ''
	})
	return winner
}

const mostBlogs = (blogs) => {

	const authorArr = []
    
	const uniq = _.toPairs(_.groupBy(blogs, 'author'))
	uniq.forEach(e => {
		const author = { author: '', blogs: '' }
		const authInst = Object.create(author)
		authInst.author = e[0]
		authInst.blogs = e[1].length
		authorArr.push(authInst)
	})
	
	const rangedList = _.orderBy(authorArr, ['blogs'], ['desc'])

	return rangedList[0]
} 

const mostLikes = (blogs) => {
	const authorArr = []
	const uniq = _.toPairs(_.groupBy(blogs, 'author'))

	
  
	uniq.forEach(e => {
		const author = { author: '', likes: '' }
		const authInst = Object.create(author)
		const likesArr = []
		console.log('checcking e: ', e)
		e[1].forEach(e => {
            
			likesArr.push(e.likes)
		}) 
      
		authInst.author = e[0]
		authInst.likes = _.sum(likesArr)
		authorArr.push(authInst)
		
		console.log('authorobject: ', authInst)
		console.log('autharr: ', authorArr )
		
	}) 
   
	const rangedList = _.orderBy(authorArr, ['likes'], ['desc'])
	return rangedList[0]
}

module.exports ={ 
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes
}