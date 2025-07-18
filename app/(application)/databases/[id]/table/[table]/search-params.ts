import { createLoader, parseAsInteger, parseAsString } from "nuqs/server";

export const searchParams = {
   sort: parseAsString.withDefault("id").withOptions({
      clearOnDefault: true,
      scroll: false,
      shallow: false,
   }),
   order: parseAsString.withDefault("asc").withOptions({
      clearOnDefault: true,
      scroll: false,
      shallow: false,
   }),
   limit: parseAsInteger.withDefault(200).withOptions({
      clearOnDefault: true,
      scroll: false,
      shallow: false,
   }),
};

export const loadSearchParams = createLoader(searchParams);
