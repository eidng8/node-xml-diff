export interface IXmlJsonAttribute {
  [index: string]: string;
}

export interface IXmlJsonItem {
  _: string;
  $: IXmlJsonAttribute;
  child?: IXmlJsonItem[];
}

export interface IXmlJsonItemExplicitChildren extends IXmlJsonItem {
  '#name': '__text__' | string;
  $$: IXmlJsonItemExplicitChildren[];
}

export interface IXmlJsonItemRearranged extends IXmlJsonItemExplicitChildren{
  child?: IXmlJsonItemExplicitChildren[];
}

export interface IXmlJson {
  [key: string]: IXmlJsonItem;
}

export interface IXmlJsonExplicitChildren {
  [key: string]: IXmlJsonItemExplicitChildren;
}
