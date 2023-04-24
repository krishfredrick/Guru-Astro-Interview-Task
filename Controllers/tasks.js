const Task = require("../Models/Task");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");

/** GET all The Task -----------------------------------> */
const getAllTask = async (req, res) => {

  // creating intial filtering with character
  const { todo, sort} = req.query;
  let search = todo === undefined?"":todo;
  let result = Task.find({
    $or: [{ todo: { $regex: search, $options: "i" } }],
    createdBy: req.user.userId,
  });



  // @--> There is No variable in Schema to sort except createdAt asc or des ..!!
  // to sort if query as been passed on api
  if(sort){
    let sortList = sort.split(',').join(" ");
    result = result.sort(sortList);
  }else{
    result = result.sort('createdAt');
  }



  // @--->: Trying to Achieve abstraction of userdetail
  result = result.select('todo createdAt updatedAt status description');

  // @--> Handling Pagination
  let page  =  Number(req.query.page) || 1;
  let limit = Number(req.query.limit) || 5;
  let skip = (page-1)*limit;
  const task = await result.skip(skip).limit(limit);

  res.status(StatusCodes.OK).json({ task, count: task.length });
};

/** Get a Single Task -------------------------------------> */
const getTask = async (req, res) => {
  const {
    user: { userId },
    params: { id: taskId },
  } = req;

  const get_task = await Task.find({
    _id: taskId,
    createdBy: userId,
  })

  if (!get_task) {
    throw new NotFoundError(`No Matching task with id${taskId}`);
  }
  res.status(StatusCodes.OK).json({ get_task });
};

/** create a Task -------------------------------------------> */
const createTask = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const task = await Task.create(req.body);
  res.status(StatusCodes.CREATED).json({ task });
};

/** update a Task -------------------------------------------> */
const updateTask = async (req, res) => {
  const {
    body: { todo },
    user: { userId },
    params: { id: taskId },
  } = req;

  if (todo === "") {
    throw new BadRequest("To-do list is empty");
  }

  const task = await Task.findByIdAndUpdate(
    {
      _id: taskId,
      createdBy: userId,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!task) {
    throw new NotFoundError(`No task with id${taskId}`);
  }
  res.status(StatusCodes.OK).json({ task });
};

/** Delete Task ----------------------------------------------------> */
const deleteTask = async (req, res) => {
  const {
    user: { userId },
    params: { id: taskId },
  } = req;
  const task = await Task.findByIdAndRemove({
    _id: taskId,
    createdBy: userId,
  });
  if (!task) {
    throw new NotFoundError(`No Task with id ${taskId}`);
  }
  res.status(StatusCodes.OK).send({ task });
};

module.exports = {
  createTask,
  deleteTask,
  updateTask,
  getAllTask,
  getTask,
};
