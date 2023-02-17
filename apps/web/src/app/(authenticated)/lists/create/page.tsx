'use client';

import { ListForm } from '../../../../components/lists/list-form/ListForm';

export default function CreateList() {
  return (
    <div className="card card-compact p-4 bg-white ">
      <h2 className="m-0 mt-5 text-center">Stwórz listę</h2>
      <ListForm />
    </div>
  );
}
