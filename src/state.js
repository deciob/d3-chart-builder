// TODO

import {
  dispatch as d3Dispatch,
} from 'd3-dispatch';


export const actions = {
  UPDATE_BRUSH_EXTENT: 'UPDATE_BRUSH_EXTENT',
  UPDATE_X_DOMAIN: 'UPDATE_X_DOMAIN',
};

export const actionHandlers = {
  updateBrushExtent: value => (
    {
      type: actions.UPDATE_BRUSH_EXTENT,
      value,
    }
  ),
  updateXDomain: value => (
    {
      type: actions.UPDATE_X_DOMAIN,
      value,
    }
  ),
  updateYDomain: value => (
    {
      type: actions.UPDATE_Y_DOMAIN,
      value,
    }
  ),
};

export function reducer(state = {}, action) {
  switch (action.type) {
    case actions.UPDATE_BRUSH_EXTENT:
      return Object.assign({}, state, {
        brushExtent: action.value,
      });
    case actions.UPDATE_X_DOMAIN:
      return Object.assign({}, state, {
        xDomain: action.value,
      });
    case actions.UPDATE_Y_DOMAIN:
      return Object.assign({}, state, {
        yDomain: action.value,
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
      actions.UPDATE_X_DOMAIN,
      actions.UPDATE_Y_DOMAIN,
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
