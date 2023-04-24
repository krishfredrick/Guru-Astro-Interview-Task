const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  todo:{
    type:String,
    required: [true, 'must provide name'],
    trim: true,
    maxlength:[50, 'name can not be more than 50 character']
  },
  description:{
    type:String,
    trim: true,
    maxlength: [200, 'not more than 200 character']
  },
  status: {
    type: String,
    enum:['Completed', 'UnFinsihed','Pending'],
    default: 'Pending',
  },
  createdBy:{
    type: mongoose.Types.ObjectId,
    ref:'User',
    required:[true, 'please provide user']
  },createdAt:{}
  
},
{timestamps: true}
)

module.exports = mongoose.model('Task', taskSchema);