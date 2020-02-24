const initialState = {
    gameState:{}
}

function rootReducer(state = initialState, action) {
    switch(action.type) {
      case "gameState":
        state.gameState = action.payload;
        return state;
      default:
        return state;
    }
}

export default rootReducer;
