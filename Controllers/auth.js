
const User = require('../Models/User')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors')
const cleanAndValidator = require('../Utils/authUtil')

const register = async(req, res)=>{
  const { name, userName, email, password} = req.body
  try {
    
    await cleanAndValidator({name, userName, email, password});
    
  } catch (error) {
    console.log(error);
    throw BadRequestError(error);
  }
  const oldUser = await User.findOne({
    $or: [
      { userName },
      { email}
    ]
  });

  if (oldUser) {
    return res.status(409).send({"error-message":"User Already Exist. Please Login"});
  }

  const user = await User.create({...req.body})
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({user: {name: user.userName}, token})
}

const login = async (req, res)=>{ 
  const {userDetail , password}= req.body

  if(!userDetail || !password){
    throw new BadRequestError('Please provide UserDetail or password')
  }
  const user = await User.findOne({
    $or: [
      { userName: userDetail },
      { email: userDetail }
    ]
  });
  if(!user){
    throw new UnauthenticatedError('Invalid Credentials user is not registerd')
  }
  const is_password_correct = await user.comparePassword(password)
  if(!is_password_correct){
    throw new UnauthenticatedError('Invalid Credentials Password is Mismatch try again')
  }
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({user: {name: user.userName}, token})
}

module.exports = {
  register, login
}