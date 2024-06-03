export const pluralize = (numberOfItems?: number) =>
  (numberOfItems ?? 0) > 1 ? "s" : "";
