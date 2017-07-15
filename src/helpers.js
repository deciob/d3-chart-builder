// @flow

import {
  entries,
} from 'd3-collection';

import {
  scaleBand,
  scaleLinear,
} from 'd3-scale';


function isObject<T>(o: T): boolean {
  return Object.prototype.toString.call(o) === '[object Object]';
}

// deep clone an object
function clone(obj: {[key: string]: any}): {[key: string]: any} {
  if (obj === null || typeof obj !== 'object') return obj;
  const copy = obj.constructor();
  Object.keys(obj).forEach((attr) => {
    copy[attr] = clone(obj[attr]);
  });
  return copy;
}

// extend target object with source object
// overriding target values with source ones
function extend(
  target: {[key: string]: any},
  source: {[key: string]: any},
): {[key: string]: any} {
  if (!isObject(target) || !isObject(source)) {
    throw new Error('extend only accepts objects');
  }

  const targetClone = clone(target);
  Object.keys(source).forEach((prop) => {
    targetClone[prop] = source[prop];
  });
  return targetClone;
}

// $FlowNoD3
function getOrdinalScale(domain, range) {
  return scaleBand()
    .rangeRound(range, 0.1)
    .padding(0.1)
    .domain(domain);
}

// $FlowNoD3
function getQuantitativeScale(scaleType, domain, range) {
  let scale;
  switch (scaleType) {
    case 'linear':
      scale = scaleLinear();
      break;
    default:
      scale = scaleLinear();
  }

  return scale
    .range(range)
    .domain(domain);
}

// for each attribute in `state` it sets a getter-setter function on `f`
function getset(
  f: (Array<mixed>) => mixed,
  state: {[key: string]: any},
): (Array<mixed>) => mixed {
  entries(state).forEach((o) => {
    /* eslint no-param-reassign:0 */
    f[o.key] = function getSetCallback(x) {
      if (x === undefined) return state[o.key];
      if (isObject(o.value)) {
        state[o.key] = extend(o.value, x);
      } else {
        state[o.key] = x;
      }
      return f;
    };
  });
  return f;
}

export default {
  clone,
  extend,
  getOrdinalScale,
  getQuantitativeScale,
  getset,
  isObject,
};
