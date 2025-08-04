// controller/UserController.js
import User from "../models/User.js"; // Mongoose model for the User schema


/**
 * @desc    Get list of all users
 * @route   GET /api/users
 * @access  Protected (any logged-in user, or you could add admin-only checks)
 */

//get user profile
 export const getUsers = async(req, res) =>{
    try {
        // Query MongoDB for all users, but only select the fields we need
        // _id is included by default; we explicitly include name & email
        const users = await User.find().select("_id name email");
        if (!users) {
            return res.status(404).json({
                success : false,
                message :"User not found"
            })
        }
        res.status(200).json({
            success:true,
            users, // 2️ Return the list of users
        }) //  Return success response with user list
    }catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to retrieve user profile"
        }) // 3️ On error, send 500 with message

    }
}
 // controller to update user role
 export const updateUserRole = async (req,res) =>{
    try{
        const userId =req.params.id; // Get user ID from request parameters
        const {role} = req.body; // Get new role from request body
        if (!["user","admin"].includes(role)){
             return res.status(400).json({error : "Inavalid role"});
        }
        const updatedUser =await User.findByIdAndUpdate(userId, {role}, {new: true});
        if (!updatedUser){
            return res.status(404).json({message :"user not found" })
        }
        res.status(200).json({
            success: true,
            message: `User role updated to ${role}`,
            user: updatedUser // 3️ Return the updated user
        }); // 4️ Return success response with updated user
    }catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update user role"
        }) // 4️ On error, send 500 with message
    }
}
    // controller to delete the  user
    export  const deleteUser = async (req,res) =>{
        try {
            const userId = req.params.id;

            // prevent admin from deleting themselves
            if (req.user.id === userId){
                return res.status(403).json({error:"Admin cannot delete themself"});
            }
            const deletedUser = await User.findByIdAndDelete(userId);
            if (!deletedUser){
                return res.status(404).json({error:"user not found"});
            }
            res.status(200).json({message:"USer deleted succesfully"});
        } catch(error){
            console.error("Deleted user error:", error);
            res.status(500).json({error:"Server error"}) ;    
           };
    
        }

        // get current user Id
        export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      users,
      currentUserId: req.user.id, // send logged-in admin ID
    });
  } catch (error) {
    console.error("Fetch users error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

    
