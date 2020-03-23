import {promises} from 'fs';
import {resolve} from 'path';
import {diff, toJson, toXml} from '../src';

describe('attrA.xml', () => {
  test('it is turned object', async () => {
    expect.assertions(1);
    const file = await read('tests/data/attrA.xml');
    const json = await toJson(file);
    expect(json).toEqual({
      parent: {
        '_': 'This element has  within it.',
        '#name': 'parent',
        '$$': [
          {
            '#name': '__text__',
            '_': 'This element has ',
          },
          {
            '_': 'embedded text',
            '#name': 'child',
            $: {t: 'test'},
            $$: [
              {
                '#name': '__text__',
                _: 'embedded text',
              },
            ],
          },
          {
            '#name': '__text__',
            '_': ' within it.',
          },
        ],
        'child': [
          {
            '_': 'embedded text',
            '$': {
              't': 'test',
            },
            '$$': [
              {
                '#name': '__text__',
                '_': 'embedded text',
              },
            ],
          },
        ],
      },
    });
  });

  test('it turns back to XML', async () => {
    expect.assertions(1);
    const file = await read('tests/data/attrA.xml');
    const json = await toJson(file);
    expect(toXml(json)).toEqual({
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

  test('it yields diff object', async () => {
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

  test('it yields diff XML', async () => {
    expect.assertions(1);
    const f1 = await read('tests/data/attrA.xml');
    const f2 = await read('tests/data/attrB.xml');
    const delta = await diff(f1, f2);
    expect(toXml(delta!)).toEqual('');
  });
});

function read(file: string): Promise<string> {
  return promises.readFile(
    resolve(file),
    {encoding: 'utf-8', flag: 'r'},
  ) as Promise<string>;
}
