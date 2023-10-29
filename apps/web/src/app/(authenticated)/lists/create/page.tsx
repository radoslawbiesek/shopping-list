import { ListForm } from 'components/lists/list-form/ListForm';

export default function CreateList() {
  return (
    <div className="card card-compact bg-white p-4 ">
      <h2 className="m-0 mt-5 text-center">Stwórz listę</h2>
      <ListForm />
    </div>
  );
}
