import { faker } from '@faker-js/faker';

import { connection, databaseClient } from '../../src/database/database';
import {
  userTable,
  categoryTable,
  listAccessTable,
  listItemTable,
  listTable,
  productTable,
} from '../../src/database/schema';

export async function mockUser(overrides: Partial<typeof userTable.$inferInsert> = {}) {
  const data = {
    email: faker.internet.email(),
    password: faker.internet.password(8),
    name: faker.internet.userName(),
    ...overrides,
  };

  const user = (await databaseClient.insert(userTable).values(data).returning())[0];
  await connection.end();
  return user;
}

export async function clearMockedUsers() {
  await databaseClient.delete(userTable);
  await connection.end();
}

export async function mockCategory(overrides: Partial<typeof categoryTable.$inferInsert> = {}) {
  let createdBy = overrides.createdBy;
  if (!createdBy) {
    const user = await mockUser();
    createdBy = user.id;
  }
  const data = {
    name: faker.random.alpha(8),
    ...overrides,
    createdBy,
  };

  const category = (await databaseClient.insert(categoryTable).values(data).returning())[0];
  await connection.end();

  return category;
}

export async function clearMockedCategories() {
  await databaseClient.delete(categoryTable);
  await connection.end();
}

export async function mockProduct(overrides: Partial<typeof productTable.$inferInsert> = {}) {
  let createdBy = overrides.createdBy;
  if (!createdBy) {
    const user = await mockUser();
    createdBy = user.id;
  }

  let categoryId = overrides.categoryId;
  if (!categoryId) {
    const category = await mockCategory({ createdBy });
    categoryId = category.id;
  }

  const data = {
    name: faker.random.alpha(8),
    description: faker.lorem.lines(2),
    image: faker.internet.url(),
    ...overrides,
    createdBy,
    categoryId,
  };

  const product = (await databaseClient.insert(productTable).values(data).returning())[0];
  await connection.end();

  return product;
}

export async function clearMockedProducts() {
  await databaseClient.delete(productTable);
  await connection.end();
}

export async function mockList(overrides: Partial<typeof listTable.$inferInsert> = {}) {
  let createdBy = overrides.createdBy;
  if (!createdBy) {
    const user = await mockUser();
    createdBy = user.id;
  }
  const data = {
    name: faker.random.alpha(8),
    ...overrides,
    createdBy,
  };

  const list = (await databaseClient.insert(listTable).values(data).returning())[0];
  await databaseClient.insert(listAccessTable).values({
    access: 'OWNER',
    createdBy,
    userId: createdBy,
    listId: list.id,
  });
  await connection.end();

  return list;
}

export async function clearMockedLists() {
  await databaseClient.delete(listTable);
  await connection.end();
}

export async function mockListItem(overrides: Partial<typeof listItemTable.$inferInsert> = {}) {
  let createdBy = overrides.createdBy;
  if (!createdBy) {
    const user = await mockUser();
    createdBy = user.id;
  }

  let listId = overrides.listId;
  if (!listId) {
    const list = await mockList({ createdBy });
    listId = list.id;
  }

  let productId = overrides.productId;
  if (!productId) {
    const product = await mockProduct({ createdBy });
    productId = product.id;
  }

  const data = {
    createdBy,
    listId,
    productId,
    isChecked: false,
    isPriority: false,
    amount: faker.datatype.number(),
  };

  const listItem = (await databaseClient.insert(listItemTable).values(data).returning())[0];

  return listItem;
}

export async function clearMockedListItems() {
  await databaseClient.delete(listItemTable);
  await connection.end();
}

export async function mockListAccess(overrides: Partial<typeof listAccessTable.$inferInsert>) {
  let createdBy = overrides.createdBy;
  if (!createdBy) {
    const user = await mockUser();
    createdBy = user.id;
  }

  let listId = overrides.listId;
  if (!listId) {
    const list = await mockList({ createdBy });
    listId = list.id;
  }

  let userId = overrides.userId;
  if (!userId) {
    const user = await mockUser();
    userId = user.id;
  }

  const listAccess = (
    await databaseClient
      .insert(listAccessTable)
      .values({ createdBy, listId, userId, access: 'READ_WRITE', ...overrides })
      .returning()
  )[0];

  return listAccess;
}

export async function clearMockedListAccesses() {
  await databaseClient.delete(listAccessTable);
  await connection.end();
}
