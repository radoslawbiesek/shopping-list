import { redirect } from 'next/navigation';

import { Divider } from '@nextui-org/react';

import * as listsService from 'services/lists.service';
import * as productsService from 'services/products.service';
import * as listItemsService from 'services/list-items.service';
import { AddListItemCard } from 'components/list-items/AddListItemCard';
import { ManageListItemCard } from 'components/list-items/ManageListItemCard';

export default async function ManageListPage({ params }: { params: { listId: string } }) {
  const listId = parseInt(params.listId);
  const { data: lists } = await listsService.getAll();
  const currentList = lists.find((list) => list.id === parseInt(params.listId));
  if (!currentList) {
    return redirect('/404');
  }

  const [{ data: products }, { data: listItems }] = await Promise.all([
    productsService.getAll(),
    listItemsService.getAll({ listId }),
  ]);

  const unusedProducts = products.filter(
    (product) => !listItems.some((listItem) => listItem.productId === product.id),
  );

  return (
    <div className="w-full">
      <h1 className="my-6 text-3xl font-semibold">{currentList.name}</h1>

      <div className="my-4">
        <span className="text-foreground/80 text-sm">Obecne produkty</span>
        <Divider />
      </div>

      {listItems.length > 0 ? (
        <div className=" flex flex-col gap-4">
          {listItems.map((listItem) => (
            <ManageListItemCard listItem={listItem} listId={listId} />
          ))}
        </div>
      ) : (
        <p className="my-4 font-semibold">Nie dodano jeszcze żadnych produktów</p>
      )}

      {unusedProducts.length > 0 && (
        <div className="my-4">
          <span className="text-foreground/80 text-sm">Dodaj produkty</span>
          <Divider />
        </div>
      )}

      <div className=" flex flex-col gap-4">
        {unusedProducts.map((product) => (
          <AddListItemCard product={product} listId={listId} />
        ))}
      </div>
    </div>
  );
}
