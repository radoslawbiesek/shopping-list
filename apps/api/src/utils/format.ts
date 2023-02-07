export function stringifyDates<T extends { createdAt: Date; updatedAt: Date; lastUsed?: Date }>(
  obj: T,
) {
  return {
    ...obj,
    updatedAt: obj.updatedAt.toISOString(),
    createdAt: obj.createdAt.toISOString(),
    ...(obj.lastUsed ? { lastUsed: obj.lastUsed.toISOString() } : {}),
  };
}
