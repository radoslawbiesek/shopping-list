'use client';

import { useRouter } from 'next/navigation';

import { Card } from '../../../components/ui/card/Card';
import { FullPageSpinner } from '../../../components/ui/full-page-spinner/FullPageSpinner';
import { useLists } from '../../../hooks/useLists';

export default function Lists() {
  const router = useRouter();
  const { lists, isLoading, isRefetching } = useLists();

  if (isLoading || isRefetching) {
    return <FullPageSpinner />;
  }

  return (
    <div className=" flex flex-col items-center">
      <h1 className="font-semibold text-3xl my-4">Listy zakupów</h1>
      <Card
        className="my-2"
        title="Dodaj nową listę"
        buttonLabel="&#x2b;"
        onClick={() => {
          router.push('/lists/create');
        }}
      />
      {lists?.map((list) => (
        <Card
          className="my-2"
          title={list.name}
          description={`Stworzona ${new Date(list.createdAt).toLocaleDateString('en-GB')}`}
          buttonLabel="&rarr;"
          onClick={() => {
            router.push(`/lists/${list.id}`);
          }}
        />
      ))}
    </div>
  );
}
