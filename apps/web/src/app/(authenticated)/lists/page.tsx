import Link from 'next/link';

import { Card, CardBody, CardFooter } from '@nextui-org/react';

import * as listsService from 'services/lists.service';

async function getAllLists() {
  const response = await listsService.getAll({});
  return response.data;
}

export default async function Lists() {
  const lists = await getAllLists();

  return (
    <div>
      <h1 className="my-4 text-3xl font-semibold">Listy zakupów</h1>
      <div className=" flex flex-col gap-4">
        <Link href="/lists/create">
          <Card isPressable>Dodaj nową listę</Card>
        </Link>
        {lists?.map((list) => (
          <Link href={`/lists/${list.id}`}>
            <Card isPressable>
              <CardBody>{list.name}</CardBody>
              <CardFooter>
                <p className="text-default-500">
                  Stworzona {new Date(list.createdAt).toLocaleDateString('pl-PL')}
                </p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
