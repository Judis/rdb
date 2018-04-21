import injectAsyncReducer from "./inject_async_reducer";

const createReducer = function(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action);
    } else {
      return state;
    }
  };
};

const add = function(state, action) {
  return {
    ...state,
    [action.payload.id]: action.payload
  };
};

const remove = function(state, action) {
  delete state[action.payload.id];

  return {
    ...state
  };
};

const batch = function(state, action) {
  return {
    ...state,
    ...action.payload
  }
}

export default function reducerFactory(storage, modelName) {
  injectAsyncReducer(
    storage,
    modelName.toLowerCase(),
    createReducer(
      {},
      {
        [`ADD_${modelName.toUpperCase()}`]: add,
        [`UPDATE_${modelName.toUpperCase()}`]: add,
        [`REMOVE_${modelName.toUpperCase()}`]: remove,
        [`BATCH_${modelName.toUpperCase()}`]: batch
      }
    )
  );
}
