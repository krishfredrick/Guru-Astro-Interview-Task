const express = require('express');

const router = express.Router();

const{
  createTask,
  getAllTask,
  updateTask,
  getTask,
  deleteTask
}=require('../Controllers/tasks');

router.route('/').post(createTask).get(getAllTask)

router.route('/:id').get(getTask).delete(deleteTask).patch(updateTask)

module.exports = router;