import { Category, PrismaClient, Product, User, List } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

export async function mockUser(overrides: Partial<User> = {}) {
  const data = {
    email: faker.internet.email(),
    password: faker.internet.password(8),
    name: faker.internet.userName(),
    ...overrides,
  };

  return await prisma.user.create({ data });
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
