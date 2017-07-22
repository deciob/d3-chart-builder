import helpers from '../src/helpers';

test('clone', () => {
  const input = { year: 1950, population: 5.2 };
  const output = helpers.clone(input);

  expect(input).toBe(input);
  expect(output).not.toBe(input);
});

test('extend', () => {
  const source = {
    year: 1960,
    incomeLevel: 'high',
  };

  const target = {
    year: 1950,
    population: 5.2,
    cities: ['Rome', 'Milan'],
  };

  const expected = {
    year: 1960,
    population: 5.2,
    cities: ['Rome', 'Milan'],
    incomeLevel: 'high',
  };

  // extend target object with source object
  // overriding target values with source ones
  const extended = helpers.extend(target, source);

  expect(extended).toEqual(expected);
  // The object is deep cloned
  expect(extended.cities).not.toBe(expected.cities);
});

test('getOrdinalScale', () => {
  const config = { width: 100 };
  const domain = ['a', 'b', 'c'];
  const scale = helpers.getOrdinalScale(config, domain);

  expect(typeof scale).toBe('function');
});

test('getset', () => {
  const f = () => {};

  const config = {
    width: 200,
    margin: { top: 10, right: 20, bottom: 30, left: 30 },
  };

  const getsetter = helpers.getset(f, config);
  expect(getsetter.width()).toEqual(200);
  expect(getsetter.margin())
    .toEqual({ top: 10, right: 20, bottom: 30, left: 30 });

  getsetter.width(400);
  expect(getsetter.width()).toEqual(400);

  getsetter.margin({ top: 100 });
  expect(getsetter.margin())
    .toEqual({ top: 100, right: 20, bottom: 30, left: 30 });
});

test('isObject', () => {
  expect(helpers.isObject('string')).toBe(false);
  expect(helpers.isObject()).toBe(false);
  expect(helpers.isObject(() => undefined)).toBe(false);
  expect(helpers.isObject(44)).toBe(false);
  expect(helpers.isObject({ number: 44 })).toBe(true);
});