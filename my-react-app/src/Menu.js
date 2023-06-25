import React from "react"
import { Link } from "react-router-dom"

import { Outlet } from "react-router-dom"

export default function Layout() {
    // const Name = JSON.parse(localStorage["currentUser"]).name;
    const Username=JSON.parse(localStorage["currentUser"]).username;
    return (
        <>
        <header className="home-container">
            <nav>
                <ul>
                    <h1>Welcome {Username}</h1>
                    <li>
                        <Link to={`/users/${Username}/info`}>Infos</Link>
                    </li>
                    <li>
                        <Link to={`/users/${Username}/todos`}>Todos</Link>
                    </li>
                    <li>
                        <Link to={`/users/${Username}/posts`}>Posts</Link>
                    </li>
                    {/* <li>
                        <Link to={`/users/${Username}/albums`}>Albums</Link>
                    </li> */}
                    <li>
                        <Link to={"/login"}>Logout</Link>
                    </li>
                </ul>
            </nav>
        </header>
        <Outlet />
        </>
    )
}