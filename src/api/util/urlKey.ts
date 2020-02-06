const toSnakeCase = (s: string) => {
  const r = s.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g);
  if (!r) throw new Error(`Failed to convert ${s} to snake case`);
  return r.map(x => x.toLowerCase()).join('_');
};

export const generateUrlKey = (s: string): string => toSnakeCase(s);
