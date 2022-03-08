// helper functions for reducer actions
import { loadDecks } from '../utils/util'
 
export const join = (dispatch, data) => {
    const defaultDeck = loadDecks(data.editions); 

    dispatch({
        type: "START_GAME",
        gid: data.gid, 
        player: data.player, 
        players: data.players, 
    })

    dispatch({
        type: "SET_CARDS",
        cards: defaultDeck.cards, 
    })

    dispatch({
        type: "SET_PUBLIC_DECKS", 
        decks: defaultDeck.decks, 
    })

    dispatch({
        type: "ADD_PLAYER_DECKS",
        player: data.player, 
    })

    for(const player of data.players) {
        dispatch({
            type: "ADD_PLAYER_DECKS",
            player: player, 
        })
    }

    console.log("joined");
}

export const startGame = (dispatch, data) => {
  
}

export const addPlayer = (dispatch, player) => {
    dispatch({
        type: "ADD_PLAYER",
        player: player, 
    })

    dispatch({
        type: "ADD_PLAYER_DECKS",
        player: player, 
    })
}

export const removePlayer = (dispatch, player) => {
    dispatch({
        type: "REMOVE_PLAYER",
        player: player, 
    })
}


export const setPreview = (dispatch, preview) => {
    dispatch({
        type: "SET_PREVIEW",
        preview, 
    })
}

export const showModal = (dispatch, deck) => {
    dispatch({
        type: "SHOW_MODAL",
        deck, 
    })
}

export const closeModal = (dispatch) => {
    dispatch({
        type: "CLOSE_MODAL",
    })
}

export const endTurn = (dispatch) => {
    dispatch({
        type: "END_TURN",
    })
}

export const moveCard = (dispatch, card, src, dest, index) => {
    dispatch({ 
        type: "REMOVE_CARD", 
        deck: src, 
        card: card
    })

    dispatch({
        type: "ADD_CARD", 
        deck: dest,
        card: card, 
        index: index, 
    })
}

export function loadSocket(dispatch, socket, navigate) {     
    socket.on("error", (message) => {
        alert(message); 
    })
    
    socket.on("addPlayer", (player) => {
        addPlayer(dispatch, player);
    })

    socket.on("endTurn", () => {
        endTurn(dispatch);
    });
    
    socket.on("removePlayer", (player) => { 
        removePlayer(dispatch, player); 
    })

    socket.on("moveCard", (card, src, dest) => {
        console.log(`received move card from ${src} to ${dest}`);
        moveCard(dispatch, card, src, dest, 0);
    })
    
    socket.on("startGame", (data) => {
        navigate('/game');
        socket.removeListener("startGame"); 
        socket.removeListener("addPlayer"); 
    })
    
}
    