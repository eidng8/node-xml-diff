import sayHello from '../src/hello';

test('it says hello', () => {
  expect(sayHello('World')).toBe('Hello World!');
});
