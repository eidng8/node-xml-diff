import {Parser, Builder} from 'xml2js';
import {diff as jsonDiff} from 'jsondiffpatch';
import {
  IXmlJsonExplicitChildren,
  IXmlJsonItem,
  IXmlJsonItemExplicitChildren, IXmlJsonItemRearranged,
} from './types';

export {diff, toJson, toXml};

async function toJson(data: string): Promise<object> {
  return new Promise((resolve, reject) => {
    new Parser({
      explicitChildren: true,
      preserveChildrenOrder: true,
      charsAsChildren: true,
    }).parseString(data, (err: Error, json: IXmlJsonExplicitChildren) => {
      if (err) {
        return reject(err);
      }
      for (const [, item] of Object.entries(json)) {
        delete item['#name'];
        rearrangeChildren(item);
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

function toXml(data: object): string {
  const builder = new Builder();
  const xml = builder.buildObject(data);
  return xml;
}

function rearrangeChildren(json: IXmlJsonItemExplicitChildren): IXmlJsonItem {
  if (json.$$) {
    delete json._;
    json.child = json.$$;
    delete json.$$;
    for (const child of json.child as IXmlJsonItemRearranged[]) {
      rearrangeChildren(child);
    }
  }

  return json;
}
