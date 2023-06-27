import React from 'react'
import { BrowserRouter, Routes, Route, useNavigate,Navigate  } from "react-router-dom";
import {useParams } from "react-router-dom";

import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Menu from "./Menu";
import NoPage from "./NoPage";
import Posts from './Posts';
import Todos from './Todos';
import Albums from './Albums';
import Info from './Info';
import Comments from "./Comments"
import Photos from "./Photos"


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
              <Route path="albums" element={<Albums />}/>
              <Route path="albums/:albumId/photos" element={<Photos />} />
              <Route path="posts" element={<Posts />} />
              <Route path="posts/:postId/" element={<Posts />} >
                <Route path="comments" element={<Comments/>} />
              </Route>
            </Route>
            <Route path="*" element={<NoPage />} />

        </Routes>

    </BrowserRouter>
  );
}





