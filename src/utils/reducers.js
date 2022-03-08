import { createStore, combineReducers } from "redux";
import io from 'socket.io-client';
import { loadCards } from './util.js';

const socketio = io("/")
function socket(state = socketio, action) {
    switch(action.type) {
        default: return state; 
    }
}


function startGame(state, players) {
    const filtered = players.filter(player => player != state.player);
    
    return {
        ...state, 
        players: filtered,
        preview: filtered.length == 0 ? "discard" : `${filtered[0]}-stable`
    }
}


const defaultGame = {
    player: "", 
    players: [], 
    gid: "",
    preview: "",
    showModal: false, 
    modal: "", 
}

function game(state=defaultGame, action) {
    switch(action.type) {
        case 'JOIN_GAME':
            return {
                ...state,
                gid: action.gid, 
                player: action.player, 
                players: action.players, 
                editions: action.editions,
            } 
        
        case 'START_GAME': 
            return startGame(state, action.players);

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
                modal: action.modal, 
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

function removeCard(state, deck, card) {
    const newDeck = state[deck].filter(tmp => card != tmp); 
    return Object.assign({}, state, {[deck]: newDeck}); 
}
  
function addCard(state, deck, card, index) {
    const newDeck = [...state[deck].slice(0, index), card, ...state[deck].slice(index)];
    return Object.assign({}, state, {[deck]: newDeck}); 
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


function decks(state={}, action) {
    switch(action.type) {
        case 'SET_DECKS': 
            return Object.assign({}, state, action.decks);
        
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

const defaultCards = loadCards();
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
