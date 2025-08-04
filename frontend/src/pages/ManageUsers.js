import  {useEffect,useState} from 'react';
import axios from '../api/axiosInstance';
import {toast} from 'react-toastify';


export default function Manageusers() {
    const [users, setusers] = useState([]);
    // fetch users from the backend

    const fetchUsers = async ()=>{
        try {
        axios.get('/users',{
            headers:{
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
        });
        setusers(response.data.users);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    };

    useEffect(()=>{
        fetchUsers();
    },[])

    // promote or demote user roles
    const updateUserRole = async (userId, newRole) => {
        try{
             const  res= await axios.put(
                `/users/${userId}/role`,
                {role :newRole}.role {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }  , 
                }
             );
                toast.success(`User role updated to ${newRole}`);
                fetchUsers(); // Refresh the user list
        }catch (error) {
            console.error("Failed to update user role:", error);
            toast.error("Failed to update user role");
        }
    };

    // Delete User
    const deleteUser =async (userId) =>{
        if(
            !window.confirm("Are you sure want to delete this user permanently..?")
        )
        return;
        try{
            await axios.delete(`/users/${userId}`,{
                headers :
                {
                Authorization:`Bearer ${localStorage.getItem("token")}`,
            },
                });
                toast.success("User deleted");
                fetchUsers(); // refresh list
        } catch(error){
            console.error("Delete Failed",error);
            toString.error("Failed to delete user")
        }
    }
    return (
        <div className='container mt-4'>
            <h2>Manage Users</h2>
            <ul className='list-group'>
                {users.map(user => (
                    <li key={user.id} className='list-group-item'>
                        <div>
                            <strong>{user.name}</strong> ({user.email}) -{""}
                            <span className='badge bg-secondary'>{user.role}</span>
                        </div>
                        <div className='btn-group'>
                            {user.role === "user" ? (
                                <button className='btn btn-sm btn-success' onClick={()=> updateUserRole(user._id,"admin")}>
                                    promote to Admin
                                </button>
                            ):(<button className='btn btn-sm btn-warning' onClick={()=>updateUserRole(user._id, "user")}>
                                Demote to User
                            </button>
                            )}
                              {/* prevent deleting Yourself */}
                              {user._id !== currentUserId && (
                                <button className='btn btn-sm btn-danger ms-2' onClick={() => deleteUser(user._id)}>
                                  delete
                                </button>
                              )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}