export function stringifyDates<T extends { createdAt: Date; updatedAt: Date }>(
  obj: T,
): T & { createdAt: string; updatedAt: string } {
  return {
    ...obj,
    updatedAt: obj.updatedAt.toISOString(),
    createdAt: obj.createdAt.toISOString(),
  };
}
