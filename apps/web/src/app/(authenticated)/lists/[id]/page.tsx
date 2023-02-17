export default function ListDetails({ params }: { params: { id: string } }) {
  return <div>{params.id}</div>;
}
