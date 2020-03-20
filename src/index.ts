import xml2js from 'xml2js';
import {diff as jsonDiff} from 'jsondiffpatch';

export {diff, toJson};

async function toJson(data: string): Promise<object> {
  return new Promise((resolve, reject) => {
    new xml2js.Parser().parseString(data, (err: Error, json: object) => {
      if (err) {
        return reject(err);
      }
      resolve(json);
    });
  });
}

async function diff(d1: string, d2: string): Promise<object | undefined> {
  return new Promise(resolve => {
    Promise.all([toJson(d1), toJson(d2)])
      .then(([j1, j2]) => {
        resolve(jsonDiff(j1, j2));
      });
  });
}
