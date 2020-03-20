import fs from 'fs';
import xml2js from 'xml2js';
import {Delta, diff as jsdiff} from 'jsondiffpatch';

export async function toJson(file: string): Promise<Object> {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) {
        return reject(err);
      }
      new xml2js.Parser().parseString(data, (err: Error, json: Object) => {
        if (err) {
          return reject(err);
        }
        resolve(json);
      });
    });
  });
}

export async function diff(
  file1: string,
  file2: string,
): Promise<Delta | undefined> {
  return new Promise(resolve => {
    Promise.all([toJson(file1), toJson(file2)])
      .then(([j1, j2]) => {
        resolve(jsdiff(j1, j2));
      });
  });
}
