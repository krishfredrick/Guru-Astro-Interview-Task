
const validator = require('validator');
const { BadRequestError } = require('../errors');


const cleanAndValidator = async({name, email, userName, password})=>{
  if(!password || !email || !userName || !name){
    throw new BadRequestError('User details are filled properly')
  }

  if(typeof email !== 'string'){
    throw new BadRequestError('Email is not a string');
  }
  if(!validator.isEmail(email)){
    throw new BadRequestError('Invalid Email format');
  }
  if(typeof userName !== 'string'){
    throw new BadRequestError('User-Name is not a string');
  }
  if(typeof password !== 'string'){
    throw new BadRequestError('password is not a string')
  }

  if(userName.length < 3 || userName.length > 30){
    throw new BadRequestError("The length of the userName is should be btw 3-30 characters")
  }
  
} 
module.exports = cleanAndValidator;