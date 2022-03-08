// helper functions for reducer actions 
export const join = (dispatch, data) => {
    dispatch({
        type: "JOIN_GAME",
        gid: data.gid, 
        player: data.player, 
        players: data.players, 
        editions: data.editions, 
    })
    console.log("joined");
}

export const startGame = (dispatch, data) => {
    dispatch({
        type: "START_GAME",
        players: data.players
    })

    dispatch({
        type: "SET_DECKS",
        decks: data.decks, 
    })
}

export const addPlayer = (dispatch, player) => {
    dispatch({
        type: "ADD_PLAYER",
        player: player, 
    })
}

export const removePlayer = (dispatch, player) => {
    dispatch({
        type: "REMOVE_PLAYER",
        player: player, 
    })

    dispatch({
        type: "REMOVE_PLAYER_CARDS",
        player: player, 
    })
}


export const setPreview = (dispatch, preview) => {
    dispatch({
        type: "SET_PREVIEW",
        preview, 
    })
}

export const setModal = (dispatch, modal) => {
    dispatch({
        type: "SHOW_MODAL",
        modal, 
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
        moveCard(dispatch, card, src, dest, 0);
    })
    
    socket.on("startGame", (data) => {
        startGame(dispatch, data);
        closeModal(dispatch);
        navigate('/game');
        socket.removeListener("startGame"); 
        socket.removeListener("addPlayer"); 
    })

    socket.on("join", (data) => {
        join(dispatch, data); 
        setModal(dispatch, "room");
    })
    
}
    