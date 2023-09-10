export type FrontMatterTypings = {
  title: string;
  description?: string;
  shortTitle: string;
  section: string;
  position: number;
}

export type MetaDataObject = {
  name: string;
  position: number;
  children: FrontMatterTypings[]
}