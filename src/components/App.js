import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Login, Join, Create, Wait } from './Lobby.js';
import Game from './Game';
import { loadSocket } from '../utils/actions';


function App() {  
  const socket = useSelector((state) => state.socket);
  const navigate = useNavigate(); 
  const dispatch = useDispatch(); 

  useEffect(() => {
    loadSocket(dispatch, socket, navigate);
    console.log("reload socket");
  }, []);
  
  return (
    <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="/game" element={<Game />} />
    </Routes>
  );
}

export default App;
