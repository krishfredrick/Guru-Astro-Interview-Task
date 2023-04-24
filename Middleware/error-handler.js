const {StatusCodes} = require('http-status-codes');
const error_handler_middleware = (err, req, res, next)=>{
  console.log(err.message);
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later'
  }
  
  // console.log(err)
  return res.status(customError.statusCode).json({
    messgae: customError.msg,
    err,
    
  })
}

module.exports = error_handler_middleware;