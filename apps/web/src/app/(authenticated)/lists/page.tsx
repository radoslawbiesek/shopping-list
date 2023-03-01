import * as listsService from '../../../services/lists.service';

import { Card } from '../../../components/ui/card/Card';

async function getAllLists() {
  const response = await listsService.getAll({});
  return response.data;
}

export default async function Lists() {
  const lists = await getAllLists();

  return (
    <div className=" flex flex-col items-center">
      <h1 className="font-semibold text-3xl my-4">Listy zakupów</h1>
      <Card className="my-2" title="Dodaj nową listę" buttonLabel="&#x2b;" href="/lists/create" />
      {lists?.map((list) => (
        <Card
          className="my-2"
          title={list.name}
          description={`Stworzona ${new Date(list.createdAt).toLocaleDateString('en-GB')}`}
          buttonLabel="&rarr;"
          href={`/lists/${list.id}`}
        />
      ))}
    </div>
  );
}
