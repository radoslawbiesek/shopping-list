import { ProductForm } from 'components/products/ProductForm';
import * as categoriesService from 'services/categories.service';

async function getAllCategories() {
  const response = await categoriesService.getAll();

  return response.data;
}

export default async function CreateList() {
  const categories = await getAllCategories();

  return (
    <>
      <h2 className="my-4 text-center text-2xl font-semibold">Dodaj nowy produkt</h2>
      <ProductForm categories={categories} />
    </>
  );
}
