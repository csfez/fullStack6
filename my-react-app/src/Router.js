import React,{useState, useEffect} from 'react'
import { BrowserRouter, Routes, Route, useNavigate,Navigate  } from "react-router-dom";
import {useParams } from "react-router-dom";

import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Menu from "./Menu";
import NoPage from "./NoPage";
import Posts from './Posts';
import Todos from './Todos';
// import Albums from './albums';
import Info from './Info';
// import Comments from "./comments"


export default function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/users/:username" element={<Menu/>}>
              <Route path="info" element={<Info />} />
              <Route path="todos" element={<Todos />}/>
              <Route path="posts" element={<Posts />} />
              <Route path="posts/:postid/" element={<Posts />} >
                <Route path="comments" element={<Info/>} />
              </Route>
            </Route>
            <Route path="*" element={<NoPage />} />

        </Routes>

    </BrowserRouter>
  );
}





