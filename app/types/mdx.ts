export type FrontMatterTypings = {
  title: string;
  description: string;
  slug: string;
  section: string;
  position: number;
}

export type MetaDataObject = {
  name: string;
  position: number;
  children: FrontMatterTypings[]
}