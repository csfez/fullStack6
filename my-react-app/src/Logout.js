import React, { useEffect } from "react"
import { Link, useNavigate, Navigate } from "react-router-dom"

export default function Logout() {
    // const navigate = useNavigate();
    useEffect(() => {
        localStorage.removeItem('currentUser');
        // alert("You are logged out. Bye bye");
    });
    // navigate('/login');
    // setTimeout(() => <Navigate to='/login' />, 2000);
    return (<div>
        <p>You are logged out. Bye bye</p>
        <Navigate to='/login' />
    </div>);
}