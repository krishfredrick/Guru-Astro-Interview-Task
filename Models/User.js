require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name:{
    type: String,
    require: true,
  },
  userName:{
    type: String,
    require: true, 
    unique: true,
  },
  email:{
    type: String,
    require: true,
    unique: true,
  },
  password:{
    type: String,
    require: true,
  },
  
},
{strict: false})

userSchema.pre('save', async function(){
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

/** mongoose method to create JWT token */
userSchema.methods.createJWT = function (){
  return jwt.sign(
    {
      userId: this._id, name: this.name
    },
    process.env.JWT_SECRET,{
      expiresIn: process.env.JWT_SPAN,
    }
  )
}

/** mongoose methods comparePassword */
userSchema.methods.comparePassword = async function (canditate_password){
  const isMatch = await bcrypt.compare(canditate_password, this.password)
  return isMatch
}

module.exports = mongoose.model('user', userSchema);