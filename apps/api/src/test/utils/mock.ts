import { Category, PrismaClient, Product, User, List, ListItem } from '@prisma/client';
import { faker } from '@faker-js/faker';

export const prisma = new PrismaClient();

export async function mockUser(overrides: Partial<User> = {}) {
  const data = {
    email: faker.internet.email(),
    password: faker.internet.password(8),
    name: faker.internet.userName(),
    ...overrides,
  };

  return await prisma.user.create({ data });
}

export async function clearMockedUsers() {
  return await prisma.user.deleteMany();
}

export async function mockCategory(overrides: Partial<Category> = {}) {
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

  return await prisma.category.create({ data });
}

export async function clearMockedCategories() {
  return await prisma.category.deleteMany();
}

export async function mockProduct(overrides: Partial<Product> = {}) {
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

  return await prisma.product.create({ data });
}

export async function clearMockedProducts() {
  return await prisma.product.deleteMany();
}

export async function mockList(overrides: Partial<List> = {}) {
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

  return await prisma.list.create({ data });
}

export async function clearMockedLists() {
  return await prisma.list.deleteMany();
}

export async function mockListItem(overrides: Partial<ListItem> = {}) {
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

  return await prisma.listItem.create({ data });
}

export async function clearMockedListItems() {
  return await prisma.listItem.deleteMany();
}
