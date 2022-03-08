
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Cards, Card } from './Game';
import { setModal, setPreview } from '../utils/actions.js';
import { getLabel, getUnicorns } from '../utils/util.js';
 

const Preview = () => {
    const preview = useSelector(state => state.game.preview);
    const isHand = preview.includes("-hand");
    const [hidden, setHidden] = useState(isHand); 
    const [icon, setIcon] = useState(isHand ? "visibility_off" : "visibility"); 

    useEffect(() => {
        setHidden(isHand);
        setIcon(isHand ? "visibility_off" : "visibility");
    }, [preview]);

    const toggleHidden = () => {
        setIcon(hidden ? "visibility" : "visibility_off");
        setHidden(!hidden);
    }
    
    return (
        <div id="preview">
            <div className="header">
                <div className="row">
                    <div id="options">
                        <div className="row">
                            <h2>{`${getLabel(preview)}`}</h2>
                            <span className='expand material-icons'>
                                expand_more
                            </span>
                        </div>
                        <PreviewOptions/>
                    </div>
                </div>
                <span className='material-icons' onClick={toggleHidden}>
                        {icon}
                </span>
            </div>
            <Cards deck={preview} hidden={hidden}/>
        </div>
    );
}

const PreviewOptions = () => {
    const players = useSelector(state => state.game.players); 
    return (
        <ul>
            {players.map(player => (
                <React.Fragment key={player}>
                    <PreviewOption player={player} type="stable"/>
                    <PreviewOption player={player} type="hand"/>
                </React.Fragment>
            ))}
        </ul>
    );
}

const PreviewOption = ({player, type}) => {
    const dispatch = useDispatch(); 
    const deck = `${player}-${type}`; 
    return (
        <li onClick={() => setPreview(dispatch, deck)}> 
            {getLabel(deck)}
        </li>
    );
}

const Pile = (props) => {
    const cards = useSelector(state => state.decks[props.deck]); 
    const card = cards ? cards[0] : null; 
    const dispatch = useDispatch(); 

    return (
       <div className="pile">
           {card ? <Card card={card} {...props}/> : <div className="card"></div>}
            
            <div className="label"  onClick={() => setModal(dispatch, props.deck)}>
                <label>{getLabel(props.deck)}</label>
            </div>     
       </div>
    );
}
Pile.defaultProps = {
    hidden: false, 
    draw: false, 
}


const Deck = ({deck, label, descriptor, getDescription}) => {
    const cards = useSelector(state => state.decks[deck]);
    return (
        <div id={deck} className="deck">
            <div className="header">
                <h2>{label}</h2>
                <p>{getDescription(cards)} {descriptor}</p>
            </div>
            <Cards deck={deck}/>
        </div>
    );
}


const Table = () => {
    const player = useSelector(state => state.game.player);
    const hand = `${player}-hand`;
    const stable = `${player}-stable`;

    return (
        <div id="table">
            <div className="row">
                <div id="piles">
                    <Pile deck="deck" hidden draw/>
                    <Pile deck="nursery" draw/>
                    <Pile deck="discard"/>
                </div>
                <Preview/>
            </div>
            <Deck 
                deck={hand} 
                label="Your Hand" 
                descriptor="Cards"
                getDescription={(cards) => cards.length}
            />
            <Deck 
                deck={stable} 
                label="Your Stable" 
                descriptor="Unicorns"
                getDescription={getUnicorns}
            />
        </div>
     
    );
}

export default Table; 