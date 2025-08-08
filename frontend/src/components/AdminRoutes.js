import react from "react";
import {Navigate} from "react-router-dom";

// simple JWT decode to get the Payload
function parseJwt(token){
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch {
        return null;
    }
}
 export default function Adminroute({children}) {

    const token=localStorage.getItem("token");
    if(!token) return <Navigate t= "/login" replace/>

     const payload =parseJwt(token);
     if (!payload || payload.role !== "admin") {
  return <Navigate to="/" replace />;
}

     return children;
 }