import NextLink from 'next/link';

import { Button } from '@nextui-org/react';

import * as categoriesService from 'services/categories.service';
import { CategoryCard } from 'components/categories/CategoryCard';

export default async function CategoriesPage() {
  const { data: categories } = await categoriesService.getAll();

  return (
    <div className="w-full">
      <h1 className="my-6 text-center text-3xl font-semibold">Moje kategorie</h1>
      <div className=" flex flex-col gap-4">
        {categories?.map((category) => <CategoryCard category={category} />)}
        <Button as={NextLink} href="/categories/form/new" color="primary" fullWidth>
          Dodaj nową kategorię
        </Button>
      </div>
    </div>
  );
}
