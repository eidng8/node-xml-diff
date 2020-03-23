import {promises} from 'fs';
import {resolve} from 'path';
import {toJson, diff} from '../src';

test('attrA.xml is OK', async () => {
  expect.assertions(1);
  const file = await read('tests/data/attrA.xml');
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

test('attrA.xml diff is OK', async () => {
  expect.assertions(1);
  const f1 = await read('tests/data/attrA.xml');
  const f2 = await read('tests/data/attrB.xml');
  const delta = await diff(f1, f2);
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

function read(file: string): Promise<string> {
  return promises.readFile(
    resolve(file),
    {encoding: 'utf-8', flag: 'r'},
  ) as Promise<string>;
}
