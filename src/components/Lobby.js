import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { editions, loadDecks } from '../utils/util';
import { closeModal, setModal } from '../utils/actions';

const Create = ({close}) => {
    const socket = useSelector(state => state.socket);
    const [name, setName] = useState("");
    const [checked, setChecked] = useState(
        new Array(editions.length).fill(false)
    );

    const checkEdition = (position) => {
       setChecked(checked.map((state, index) => (
            (position == index) ? !state : state 
       )))
    }
    
    const createGame = () =>  {
        const checkedEditions = editions.filter((edition, index) => checked[index]); 
        if(checkedEditions.length == 0) {
            alert("You must select at least one edition"); 
        } else {
            socket.emit("createGame", {player: name, editions: checkedEditions});
        }
    }

    return (
        <form onSubmit={createGame}>
            <div onClick={close} id="back"><span className="material-icons">cancel</span></div>
            <h2>Stable Unicorns</h2>
            <input 
                type="text" 
                value={name}
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
            />
            <div id="editions">
            <label>Editions</label> 
                <ul>
                {editions.map((edition, index) => (
                    <li key={edition}>
                        <input 
                            type="checkbox" 
                            checked={checked[index]} 
                            onChange={() => checkEdition(index)}
                        />
                        <span className="check"></span>
                        <span>{edition}</span>
                    </li>
                ))}   
                </ul>  
            </div>
            <div onClick={createGame} className="button submit">Create Game</div>
        </form> 
    )
}

const Join = ({close}) => {
    const socket = useSelector(state => state.socket);
    const [name, setName] = useState("");
    const [gid, setGid] = useState("");

    const joinGame = () =>  { 
        socket.emit("joinGame", {player: name, gameID: gid});
    }

    return (
        <form onSubmit={joinGame}>
            <div onClick={close} id="back"><span className="material-icons">cancel</span></div>
            <h2>Stable Unicorns</h2>
            <input 
                type="text" 
                value={name}
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
            />   
            <input 
                type="text" 
                value={gid}
                placeholder="Game Code"
                onChange={(e) => setGid(e.target.value)}
            />                   
            <div onClick={joinGame} className="button submit">Join Game</div>
        </form> 
    )
}


const Room = ({close}) => {
    const socket = useSelector(state => state.socket);
    const gid = useSelector(state => state.game.gid);
    const players = useSelector(state => state.game.players);
    const editions = useSelector(state => state.game.editions);

    const startGame = () => {
        const decks = loadDecks(players, editions); 
        socket.emit("startGame", {players:players, decks:decks});
        close();
    }

    const leaveRoom = () => {
        socket.emit("leaveRoom");
        close();
    }

    return (
        <form onSubmit={startGame}> 
            <div onClick={leaveRoom} id="back"><span className="material-icons">cancel</span></div>
            <h2>Add Other Players</h2>
            <p id="code">Game Code: {gid}</p>
            <hr/> 
            <ul id="players">
                {players.map((name) => (
                    <li key={name}>{name}</li>
                ))}
            </ul>
            <input className="button submit" type="submit" value="Start Game" />
        </form> 
    )
}


const LoginModal = () => {
    const modal = useSelector(state => state.game.modal);
    const dispatch = useDispatch();

    const close = () => {
        closeModal(dispatch); 
    }

    return (
        <React.Fragment>
            <div className="backdrop"></div>
            {(modal == "join") && <Join close={close}/>}
            {(modal == "create") && <Create close={close}/>} 
            {(modal == "room") && <Room close={close}/>}
        </React.Fragment>
    );
}

const Login = () => {
    const dispatch = useDispatch();
    const showModal = useSelector(state => state.game.showModal);

    return (
        <div id="lobby">
            <div id="login">
                <img src="images/dark.jpeg"/>
                <div>
                    <h1>Unstable Unicorns</h1>
                    <h3>The online card game</h3>
                    <p id="description">Build a unicorn army. Betray your friends. Unicorns are your friends now.</p>

                    <div className="row">
                        <div className="button" onClick={() => setModal(dispatch, "create")}>New Game</div>
                        <div className="button" onClick={() => setModal(dispatch, "join")}>Join Game</div>
                    </div>
                </div>
            </div>
            
            {showModal && <LoginModal/>}
          
        </div>
    )
}

export {
    Login,
}