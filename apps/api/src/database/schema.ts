import {
  pgTable,
  pgEnum,
  timestamp,
  text,
  integer,
  serial,
  boolean,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

import { sql } from 'drizzle-orm';
export const access = pgEnum('Access', ['READ_WRITE', 'OWNER']);

const baseDates = {
  createdAt: timestamp('createdAt', { precision: 6, withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt', { precision: 6, withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
};

export const listItemTable = pgTable('ListItem', {
  id: serial('id').primaryKey().notNull(),
  listId: integer('listId')
    .notNull()
    .references(() => listTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  productId: integer('productId')
    .notNull()
    .references(() => productTable.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
  amount: integer('amount').notNull(),
  isChecked: boolean('isChecked').default(false).notNull(),
  isPriority: boolean('isPriority').default(false).notNull(),
  createdBy: integer('createdBy')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  ...baseDates,
});

export const categoryTable = pgTable(
  'Category',
  {
    id: serial('id').primaryKey().notNull(),
    name: text('name').notNull(),
    createdBy: integer('createdBy')
      .notNull()
      .references(() => userTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    ...baseDates,
  },
  (table) => {
    return {
      nameKey: uniqueIndex('Category_name_key').on(table.name),
    };
  },
);

export const userTable = pgTable(
  'User',
  {
    id: serial('id').primaryKey().notNull(),
    email: text('email').notNull(),
    name: text('name').notNull(),
    password: text('password').notNull(),
    ...baseDates,
  },
  (table) => {
    return {
      emailKey: uniqueIndex('User_email_key').on(table.email),
      nameKey: uniqueIndex('User_name_key').on(table.name),
    };
  },
);

export const productTable = pgTable('Product', {
  id: serial('id').primaryKey().notNull(),
  name: text('name').notNull(),
  description: text('description'),
  image: text('image'),
  categoryId: integer('categoryId')
    .notNull()
    .references(() => categoryTable.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
  createdBy: integer('createdBy')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  lastUsed: timestamp('lastUsed', { precision: 6, withTimezone: true, mode: 'date' }),
  ...baseDates,
});

export const listTable = pgTable('List', {
  id: serial('id').primaryKey().notNull(),
  name: text('name').notNull(),
  createdBy: integer('createdBy')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  ...baseDates,
});

export const listAccessTable = pgTable('ListAccess', {
  id: serial('id').primaryKey().notNull(),
  listId: integer('listId')
    .notNull()
    .references(() => listTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  userId: integer('userId')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  access: access('access').notNull(),
  createdBy: integer('createdBy')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  ...baseDates,
});

export type User = typeof userTable.$inferSelect;
