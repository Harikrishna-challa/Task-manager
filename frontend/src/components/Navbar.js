import React from "react";
import {useNavigate} from "react-router-dom"; // Import the useNavigate hook for navigation 

function Navbar(){
    const navigate=useNavigate(); // Hook to programmatically navigate to different routes
    const Logout=()=>{
        localStorage.removeItem("token"); // Remove the token from local storage
        navigate("/login"); // Redirect to login page after logout
    }
    return(
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
            <span className="navbar-brand">Task Manager</span>
            <div className="ml-auto">
                <button className="btn btn-danger" onClick={Logout}>
                    Logout
                </button>

            </div>

        </nav>
    );
}
export default Navbar; // Export the Navbar component for use in other parts of the application
// // This code defines a navigation bar component in React that includes a logout button. When the logout button is clicked, it removes the authentication token from local storage and redirects the user to the login page.