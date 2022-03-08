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
        
        case 'REMOVE_PLAYER': 
            return {
                ...state, 
                players: state.players.filter(player => player != action.player),
                preview: (state.preview == action.player) ? "discard" : state.preview
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
    return {
        ...state, 
        [deck]: state[deck].filter(tmp => card != tmp)
    }
}
  
function addCard(state, deck, card, index) {
    const newDeck = [...state[deck].slice(0, index), card, ...state[deck].slice(index)];
    return {
        ...state, 
        [deck]: newDeck
    }
}


function discardCards(cards) {
    return {
        discard: cards.filter(card => !card.includes("Baby Unicorn")), 
        nursery: cards.filter(card => card.includes("Baby Unicorn")), 
    }
}

function endTurn(state) {
    const cards = discardCards(state.turn); 

    const result = {
        ...state, 
        turn: [], 
        discard: [...cards.discard, ...state.discard],
        nursery: [...cards.nursery, ...state.nursery]
    }

    return result; 
}

function removePlayerCards(state, player) {
    const stable = `${player}-stable`;
    const hand = `${player}-hand`;
    const cards = discardCards(state[hand].concat(state[stable])); 
    
    return {
        ...state, 
        discard: [...cards.discard, ...state.discard], 
        nursery: [...cards.nursery, ...state.nursery], 
        [stable]: [],
        [hand]: [],
    }
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

        case 'REMOVE_PLAYER': 
            return removePlayerCards(state, action.player);

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
