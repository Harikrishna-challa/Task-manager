//backend/services/taskService.js
import Task from "../models/task.js";

//Create a new task
export const createTaskInDB =async ({
    title,description,dueDate,Priority,status,assignedTo, createdBy
})=>{
    return await Task.create({
        title,description,dueDate,Priority,status,assignedTo, createdBy
    });
};
// Find tasks by a filter
export const findTaskByIdInDB = async (filter) =>
{
    return await Task.find(filter)
        .populate("assignedTo", "name email")
        .populate("createdBy","name email");
};

//update a task by ID
export const updateTaskByIdInDB = async (id, updateTaskData)=>{
    return await Task.findByIdAndUpdate(id, updateTaskData,{
        new:true,
        runValidators:true
    });
};

// Delete a task by ID
export const deleteTaskByIdInDB = async (id) =>{
    return await Task.findByIdAndDelete(id);
};

//get a task by ID in the dashboard
export const getDashboardTasksInDB = async (userId, now) =>
{
    return await Task.find({
        $or: [
            { createdBy: userId },
            { assignedTo: userId }
        ]
    })
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");
};