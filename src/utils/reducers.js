import { createStore, combineReducers } from "redux";
import socketClient from 'socket.io-client';
import { loadDecks } from './util.js';

const port = "http://localhost:8080";
const socketio = socketClient(port);
function socket(state = socketio, action) {
    switch(action.type) {
        default: return state; 
    }
}

const defaultGame = {
    player: "player", 
    players: ["player1", "player2", "player3"], 
    gid: "",
    preview: "player1-hand",
    showModal: false, 
    modal: "", 
}

function game(state=defaultGame, action) {
    switch(action.type) {
        case 'START_GAME':
            return {
                ...state,
                gid: action.gid, 
                player: action.player, 
                players: action.players, 
            } 
        
        case 'ADD_PLAYER': 
            return {
                ...state, 
                players: [...state.players, action.player]
            }
        
        case 'SET_PREVIEW':
            return {
                ...state, 
                preview: action.preview, 
            }
        case 'SHOW_MODAL':
            return {
                ...state, 
                showModal: true, 
                modal: action.deck, 
            }
        case 'CLOSE_MODAL':
            return {
                ...state, 
                showModal: false, 
                modal: "",
            }
        default: 
            return state; 
    }
}

const defaultDecks = loadDecks(["Base"]).decks; 

function removeCard(state, deck, card) {
    const newDeck = state[deck].filter(tmp => card != tmp); 
    return Object.assign({}, state, {[deck]: newDeck}); 
}
  

function addCard(state, deck, card, index) {
    const newDeck = [...state[deck].slice(0, index), card, ...state[deck].slice(index)];
    return Object.assign({}, state, {[deck]: newDeck}); 
}

function addPlayerDecks(state, player) { 
    return Object.assign({}, state, 
        {[player+"-hand"]: []},
        {[player+"-stable"]: []});  
}

function endTurn(state) {
    const nurseryCards = state.turn.filter(card => card.includes("Baby Unicorn"));
    const discardCards = state.turn.filter(card => !card.includes("Baby Unicorn"));

    const result = {
        ...state, 
        turn: [], 
        discard: [...discardCards, ...state.discard],
        nursery: [...nurseryCards, ...state.nursery]
    }

    return result; 
}


function decks(state=defaultDecks, action) {
    switch(action.type) {
        case 'SET_PUBLIC_DECKS': 
            return Object.assign({}, state, action.decks);
        
        case 'ADD_PLAYER_DECKS':      
            return addPlayerDecks(state, action.player);
        
        case 'REMOVE_CARD':
            return removeCard(state, action.deck, action.card); 
        
        case 'ADD_CARD':
            return addCard(state, action.deck, action.card, action.index);
        
        case 'END_TURN': 
            return endTurn(state); 

        default: 
            return state; 
    }
}

const defaultCards = loadDecks(["Base"]).cards; 
function cards(state=defaultCards, action) {
    switch(action.type) {
        case 'SET_CARDS':
            return action.cards; 

        default: 
            return state; 
    }
}

const reducer = combineReducers({
    socket, 
    game,
    decks,
    cards,
})

const store = createStore(reducer);
export default store;
