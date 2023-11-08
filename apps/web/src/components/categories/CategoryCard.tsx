import { Card, CardBody } from '@nextui-org/react';
import { XMarkIcon } from '@heroicons/react/20/solid';

import * as categoriesActions from 'actions/categories.actions';
import { ServerActionButton } from 'components/common/ServerActionButton';
import { Category } from 'services/categories.service.types';

export function CategoryCard({ category }: { category: Category }) {
  return (
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
  );
}
