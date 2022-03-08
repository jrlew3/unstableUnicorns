
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import Sidebar from './Sidebar';
import Table from './Table';

import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import { moveCard, closeModal } from '../utils/actions.js';
import { getLabel, cardBack } from '../utils/util.js';
 
const Modal = () => {
    const show = useSelector(state => state.game.showModal); 
    const deck = useSelector(state => state.game.modal); 
    const [hidden, setHidden] = useState(deck != "deck");

    const dispatch = useDispatch();

    const toggleHidden = () => {
        setHidden(!hidden); 
    }

    useEffect(() => {
        setHidden(deck == "deck");
    }, [deck]);

    if(!show) return null; 
    return (
        <React.Fragment>
            <div className="backdrop"></div>
            <div id="modal">
                <div className="header">
                    <div className="row">
                        <h3>{getLabel(deck)}</h3>
                        <span onClick={toggleHidden} className="material-icons">
                            {hidden ? "visibility_off" : "visibility"} 
                        </span>
                    </div>
                    <span className="material-icons"
                        onClick={() => closeModal(dispatch)}>
                        cancel
                    </span>
            
                </div>
     
                <Cards deck={deck} hidden={hidden}/>
 
            </div>
        </React.Fragment>
    )
}

const Cards = (props) => {
    const cards = useSelector(state => state.decks[props.deck]);
    return (
        <Droppable droppableId={props.deck} direction="horizontal">
            {provided => (
                <div className = "cards" 
                    ref={provided.innerRef} 
                    {...provided.droppableProps}
                > 
                    {cards && cards.map((card, index) => 
                        <Draggable index={index} key={card} draggableId={card}>
                            {dragProvided => (
                                <div
                                    ref={dragProvided.innerRef}
                                    {...dragProvided.draggableProps}
                                    {...dragProvided.dragHandleProps}

                                >
                                <Card card={card} {...props}/>
                                </div>
                            )}
                        </Draggable>
                    )}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    )
}
Cards.defaultProps = {
    hidden: false,
}

const Card = ({card, deck, hidden, draw}) => {
    const data = useSelector(state => state.cards[card.split("#")[0]]); 
    const socket = useSelector(state => state.socket);
    const player = useSelector(state => state.game.player);
    const modal = useSelector(state => state.game.modal); 
    const img = hidden ? cardBack : data.img; 
    const hand = player+"-hand";
    const stable = player+"-stable";
    const playable = deck == hand || deck == stable;  

    const clickable = deck == modal || !["nursery", "discard", "deck"].includes(deck);
    const action = playable ? "cancel" : "add_circle"; 
    const onDoubleClick = () => {
        if(playable) socket.emit("moveCard", card, deck, "turn"); 
    }
    const onClick = () => {
        const dest = playable ? "discard" : hand; 
        socket.emit("moveCard", card, deck, dest); 
    }

    const drawCard = () => {
        socket.emit("moveCard", card, deck, hand);
    }

    return (
        <div className="card">
            <img onDoubleClick={onDoubleClick} src={img} alt={card}/>
            {clickable && <span className="row material-icons" onClick={onClick}>{action}</span>}
            {draw && <span onClick={drawCard} className="draw material-icons">add_circle</span>}
        </div>
    ); 
}
Card.defaultProps = {
    hidden: false, draw: false,
}

const Game = () => {
    const socket = useSelector(state => state.socket);
    const dispatch = useDispatch(); 

    const onDragEnd = result => {
        if(!result.destination) return;
        const src = result.source.droppableId; 
        const dest = result.destination.droppableId; 
        const card = result.draggableId; 
        const index = result.destination.index; 
        
        moveCard(dispatch, card, src, dest, index);
        if(src != dest) {
            socket.emit("dragCard", card, src, dest);
        }
    }

    console.log("reload game");
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div id="game">
                <Sidebar/>
                <Table/> 
                <Modal/> 
            </div>         
        </DragDropContext>
    );
}

export default Game; 
export { 
    Cards,
    Card,
}

