// TODO

import {
  dispatch as d3Dispatch,
} from 'd3-dispatch';


export const actions = {
  UPDATE_BRUSH_EXTENT: 'UPDATE_BRUSH_EXTENT',
};

export const actionHandlers = {
  updateBrushExtent: function updateBrushExtent(value) {
    return {
      type: actions.UPDATE_BRUSH_EXTENT,
      value,
    };
  },
};

export function reducer(state = {}, action) {
  switch (action.type) {
    case actions.UPDATE_BRUSH_EXTENT:
      return Object.assign({}, state, {
        brushExtent: action.value,
      });
    default:
      return state;
  }
}

export function createStore(preloadedState) {
  let currentState = preloadedState;

  const dispatcher =
    d3Dispatch(
      actions.UPDATE_BRUSH_EXTENT,
    );

  function dispatch(action) {
    currentState = reducer(currentState, action);
    dispatcher.call(action.type, null, currentState);
  }

  function subscribe(action, callback) {
    dispatcher.on(action, callback);
    return function unsubscribe() {
      dispatcher.on(action, null);
    };
  }

  function getState() {
    return currentState;
  }

  return {
    dispatch,
    getState,
    subscribe,
  };
}
