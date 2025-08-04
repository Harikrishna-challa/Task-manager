/* returns an express middleware function that checks
* if the logged-in user's role is in requiredRoles
*@param {string[]} requiredRoles — e.g. ["admin"]
*/
 export const checkRole =(requiredRoles) =>{
    // this outer function captures requiredroles in its closure
    return (req,res, next) =>{
        const userRole =req.user.role; // req.user set by your isAuthenticated JWT middleware
        // if the user's role isn't in the whitelist
        if(!requiredRoles.includes(userRole)){
            return res.status(403).json({message:"forbidden"})
        }
        //otherwise,allow the request to continue
        next();
    }
 }

