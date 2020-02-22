export type FilterObject<Entity> =
  | Partial<Entity>
  | {
      [key in keyof Entity]?: { $in: Array<Entity[key]> };
    };

const toFilterClause = (
  filter: { $in: Array<any> },
  property: string,
  filterName: string,
  nodeVariableName: string
) => {
  if (filter.$in) {
    return `${nodeVariableName}.${property} IN $${filterName}.${property}.\`$in\``;
  }
  return `${nodeVariableName}.${property} = $${filterName}.${property}`;
};

// TODO: tests
export const buildFilter = <Entity>(
  filterObject: FilterObject<Entity>,
  filterName: string,
  nodeVariableName: string
): string => {
  if (Object.keys(filterObject).length == 0) return '';

  const whereFilterString =
    '(' +
    Object.keys(filterObject)
      .map(key => toFilterClause(filterObject[key], key, filterName, nodeVariableName))
      .join(' AND ') +
    ')';
  return whereFilterString;
};
