import helpers from './helpers';

test('clone', () => {
  const input = {year: 1950, population: 5.2};
  const output = helpers.clone(input);

  expect(input).toBe(input);
  expect(output).not.toBe(input);
});

test('extend', () => {
  const source = {
    year: 1960,
    incomeLevel: "high",
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
    incomeLevel: "high",
  }

  // extend target object with source object
  // overriding target values with source ones
  const extended = helpers.extend(target, source);

  expect(extended).toEqual(expected);
  // The object is deep cloned
  expect(extended.cities).not.toBe(expected.cities);
});

test('getOrdinalScale', () => {
  const config = {width: 100};
  const domain = ['a', 'b', 'c'];
  const scale = helpers.getOrdinalScale(config, domain);

  expect(typeof scale).toBe('function');
});
