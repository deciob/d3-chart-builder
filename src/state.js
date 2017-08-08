import {
  dispatch as d3Dispatch,
} from 'd3-dispatch';


export const actions = {
  UPDATE_CONFIGURATION: 'UPDATE_CONFIGURATION',
};

export const actionHandlers = {
  updateConfiguration: function updateConfiguration(value) {
    return {
      type: actions.UPDATE_CONFIGURATION,
      value,
    };
  },
};

export function reducer(state = {}, action) {
  switch (action.type) {
    case actions.UPDATE_CONFIGURATION:
      return Object.assign({}, state, {
        configuration: action.value,
      });
    default:
      return state;
  }
}

export function createStore(preloadedState) {
  let currentState = preloadedState;

  const dispatcher =
    d3Dispatch(
      actions.UPDATE_CONFIGURATION,
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
