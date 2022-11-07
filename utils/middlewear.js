const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const requestLogger = (request, response, next) => {
	logger.info('Method:', request.method)
	logger.info('Path:  ', request.path)
	logger.info('Body:  ', request.body)
	logger.info('---')
	next()
}

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
	logger.error('error message: ', error.message)


	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	} else if(error.name.includes('JsonWebTokenError') || error.message.includes('Unexpected token')){
		return response.status(401).json({ error: 'JsonWeb Token is invalid' })
	}

	next(error)
}



const tokenExtractor = (request, response, next) => {
	
	const authorization = request.get('authorization')
	
	try{
		if (authorization && authorization.toLowerCase().startsWith('bearer ')){
			request.token = authorization.substring(7)
		}
	}catch(exception){
		next(exception)
		
	}

	next()
}


const userExtractor = async (request, response, next) => {
	
	const authorization = request.token
	logger.info('authorization: ', authorization)
	try{
		const verification = jwt.verify(authorization, process.env.SECRET)
		request.user = await User.findById(verification.id)
		
	}catch(exception){
		next(exception)
		
	}
	
	next()

}
module.exports = {
	requestLogger,
	unknownEndpoint,
	errorHandler,
	tokenExtractor,
	userExtractor
}