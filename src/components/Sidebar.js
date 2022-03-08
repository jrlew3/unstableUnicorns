import React, { useState } from 'react';
import { Cards } from './Game.js'
import { useSelector } from "react-redux";


const Rules = () => {
    const [icon, setIcon] = useState("expand_less"); 
    const toggle = () => {
        icon == "expand_less" ? setIcon("expand_more") : setIcon("expand_less"); 
    }

    return (
        <div id="rules">
            <div className="header">
                <h4> Rules </h4>
                <span onClick={toggle} className="material-icons">{icon}</span>
            </div>

            {icon == "expand_less" && 
                <div className="card">
                    <img src="images/rules.png"/>    
                </div>
            }
        </div>
    )
}

const Turn = () => {
    const socket = useSelector(state => state.socket);
        
    const endTurn = () => {
        socket.emit("endTurn");
    }

    return (
        <div id="turn">
            <div className="header">
                <h4>Current Turn</h4>
                <span onClick={endTurn} className="material-icons">
                    arrow_forward
                </span>
            </div>


            <Cards deck="turn"/>
        </div>
    )
}

const Sidebar = () => {
    return (
        <div id="sidebar">
            <Rules/> 
            <Turn/>
        </div>
    )
}

export default Sidebar; 
