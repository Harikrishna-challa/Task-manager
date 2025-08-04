//models/task.js
import mongoose from "mongoose";

const taskSchema=new mongoose.Schema(
    {
        title:{
            type:String,
            required:[true,"Task title is required"],
            trim:true,
        },
        description:{
            type: String,
            trim:true,
        },
        dueDate: {
            type:Date,
        },
        priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium",
        },
        status:{
            type:String,
            enum:["pending","in-progress","completed"],
            default:"pending",  
        },
        // field: who the task is assigned to
        assignedTo: {
        type: mongoose.Schema.Types.ObjectId,// stores the_id of a user
        ref: "user",// reference to the user model
        required:[ true,"Please assign this task to  a user"],
        },
        // field: who created the task.Automatically set to the user who created it
        createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
}
    },
    {
        timestamps:true,
    }
);
const Task=mongoose.model("Task",taskSchema);
export default Task;
// Explanation:
// • We added `assignedTo` with required:true so no task can be created without an assignee.
// • We added `createdBy` so we track which user created it.
// • `ref: "User"` lets us populate user details when fetching tasks.