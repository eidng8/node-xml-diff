import path from 'path';
import {toJson, diff} from '../src';

test('it returns object', async () => {
  expect.assertions(1);
  const file = path.resolve('tests/data/attrA.xml');
  const json = await toJson(file);
  expect(json).toEqual({
    parent: {
      _: 'This element has  within it.',
      child: [
        {
          $: {t: 'test'},
          _: 'embedded text',
        },
      ],
    },
  });
});

test('it returns difference', async () => {
  expect.assertions(1);
  const delta = await diff(
    path.resolve('tests/data/attrA.xml'),
    path.resolve('tests/data/attrB.xml'),
  );
  expect(delta).toEqual({
    parent: {
      child: {
        _t: 'a',
        0: {
          $: {t: ['test', 'test2']},
        },
      },
    },
  });
});
