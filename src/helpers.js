// @flow

function clone(obj: {[key: string]: any}): {[key: string]: any} {
  if (obj === null || typeof obj !== 'object') return obj;
  // WARNING: will fail with angular Resources, call toJSON first!
  const copy = obj.constructor();
  Object.keys(obj).forEach(attr => {
    copy[attr] = clone(obj[attr]);
  });
  return copy;
}

export default {
  clone,
};
