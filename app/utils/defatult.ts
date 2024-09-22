export const DEFAULT_TAG = 'main'

export const mergeObjects = <T extends object, U extends object>(firstObj: T, secondObj: U): T & U => {
  return { ...firstObj, ...secondObj };
};
