export interface ItemMetadata {
  image: string;
  name: string;
  description: string;
  attributes: ItemAttribute[];
}

export enum DisplayType {
  Number = "number",
  BoostPercentage = "boost_percentage",
  BoostNumber = "boost_number",
  Date = "date",
}

export interface ItemAttribute {
  trait_type: string;
  display_type: DisplayType;
  value: string;
}

export interface Item {
  id: number;
  uri: string;
}

export interface ItemWithFeatures extends Item {
  owner: string;
  earned: number;
}
