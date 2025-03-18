type EmptyObject = { [K in string | number]: never };

import isObject from "./is-object";

export default function isObjectEmpty(value: unknown): value is EmptyObject {
   return isObject(value) && !Object.keys(value).length;
}
