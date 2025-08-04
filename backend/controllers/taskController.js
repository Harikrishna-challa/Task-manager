import Task from "../models/task.js";
import {
  createTaskInDB,
  findTaskByIdInDB,
  updateTaskByIdInDB,
  deleteTaskByIdInDB,
  getDashboardTasksInDB,
} from "../services/taskService.js";

// create a new task
// controllers/taskController.js

/**
 * @desc   Create a new task (Admins only)
 * @route  POST /api/tasks
 * @access Admin
 */
export const createTask = async (req, res) => {
  try {
    // ——— In-controller role check ———
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: admins only" });
    }

    // ——— Business logic ———
    // Use your service layer (createTaskInDB) to persist the task
    const newTask = await createTaskInDB({
      ...req.body,
      createdBy: req.user._id,  // attach creator's ID
    });

    // ——— Successful response ———
    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task:    newTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create task",
    });
  }
};

// get all tasks for dashboard
export const getTasks = async(req,res)=>{
  try {
    // extract query parameters
    const {page=1,limit=10,search="",status,priority,overdue} =req.query;
    // build the filter object
    const filter ={
      $or : [{createdBy: req.user._id}, {assignedTo: req.user._id}] // filter by creator
    };
    if(status) filter.status = status; // filter by status
    if(priority) filter.priority = priority; // filter by priority
    if(search) filter.title = { $regex: search, $options: "i" }; // search by title
    if(overdue== "true") {
      filter.dueDate = { $lt: new Date() }; // filter overdue tasks
      filter.status = "pending"; // only pending overdue tasks
      filter.status = "in-progress"; // only in-progress overdue tasks
      filter.status = "completed"; // only completed overdue tasks
    }
    const skip = (Number(page) - 1) * Number(limit);
    const tasks =await Task.find(filter) // find tasks based on filter
    .skip(skip) //skip for pagination
    .limit(Number(limit)) // limit results
    .sort({ createdAt: -1 });// sort by creation date descending

    // calculate total tasks for pagination
    const totalTasks = await Task.countDocuments(filter);
 
    // Return the tasks and pagination info
    return res.status(200).json({
      success: true,
      tasks, // return the tasks
      totalTasks,// total number of tasks
      page: Number(page),// current page number
      totalpages: Math.ceil(totalTasks / Number(limit)),// total number of pages
      limit: Number(limit), // number of tasks per page
      user: req.user, // include user info
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve tasks",
    });
  };
};
// get a task by ID
export const getTaskById =async(req,res)=>{
  try{
    const task =await findTaskByIdInDB(req.params.id);
    if(!task){
      return res.status(404).json({
        success: false,
        message: "Task not found",
      })
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message : error.message || "Failed to retrieve task"
    })
  }
}
 // update a task by ID 
 export const updateTask = async (req,res) =>{
  try{
    const updatedTask =await updateTaskByIdInDB(req.params.id,req.user.id,req.body);
    if(!updatedTask){
      return res.status(404).json({
        succes: false,
        message: "Task not found or you are not authorized to update it",
      })
    }
  }catch(error){
    {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to update task"
      })
  }
 };
};
 // delete a task by ID
  export const deleteTask = async (req,res) =>{
    try{
      const deletedTask = await deleteTaskByIdInDB(req.params.id, req.user._id);
      if(!deletedTask){
        return res.status(404).json({
          success:false,
          message: "Task not found or you are not authorized to delete it",
        })
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to delete task"
      });
    }
  }

// get dashboard tasks
export const getDashboardTasks = async (req, res) => {
  try {
    const userId = req.user._id; // Get the logged-in user's ID
    const now = new Date(); // Current date for overdue tasks

    // Fetch tasks from the service
    const allTasks = await getDashboardTasksInDB(userId, now);

    // Split tasks into categories
    const assignedTasks = allTasks.filter(
      (task) => task.assignedTo && task.assignedTo.toString() === userId.toString()
    );
    const createdTasks = allTasks.filter(
      (task) => task.createdBy && task.createdBy.toString() === userId.toString()
    );
    const overdueTasks = allTasks.filter(
      (task) =>
        task.dueDate &&
        task.dueDate < now &&
        task.status !== "completed" &&
        (task.createdBy.toString() === userId.toString() ||
          task.assignedTo.toString() === userId.toString())
    );

    // Fetch user details
    const user = {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    };

    // Return the categorized tasks and user info
    return res.status(200).json({
      success: true,
      user,
      assignedTasks,
      createdTasks,
      overdueTasks,
    });
  } catch (error) {
    console.error("Error in getDashboardTasks:", error); // Log the error for debugging
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve dashboard tasks",
    });
  }
};
