import { CategoryForm } from 'components/categories/CategoryForm';

export default async function CategoryFormPage() {
  return (
    <>
      <h2 className="my-4 text-center text-2xl font-semibold">Dodaj nową kategorię</h2>
      <CategoryForm />
    </>
  );
}
