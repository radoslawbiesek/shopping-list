import NextLink from 'next/link';

import { Button, Card, CardBody } from '@nextui-org/react';
import { XMarkIcon } from '@heroicons/react/20/solid';

import * as categoriesActions from 'actions/categories.actions';
import * as categoriesService from 'services/categories.service';
import { ServerActionButton } from 'components/common/ServerActionButton';

export default async function CategoriesPage() {
  const { data: categories } = await categoriesService.getAll();

  return (
    <div className="w-full">
      <h1 className="my-6 text-center text-3xl font-semibold">Moje kategorie</h1>
      <div className=" flex flex-col gap-4">
        {categories?.map((category) => (
          <Card fullWidth key={category.id}>
            <CardBody className="flex flex-row items-center justify-between">
              <p className="font-semibold">{category.name}</p>
              <ServerActionButton
                isIconOnly
                color="danger"
                variant="light"
                action={async () => {
                  'use server';
                  await categoriesActions.remove(category.id);
                }}
                size="sm"
              >
                <XMarkIcon />
              </ServerActionButton>
            </CardBody>
          </Card>
        ))}
        <Button as={NextLink} href="/categories/form/new" color="primary" fullWidth>
          Dodaj nową kategorię
        </Button>
      </div>
    </div>
  );
}
