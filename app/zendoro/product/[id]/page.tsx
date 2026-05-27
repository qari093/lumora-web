type Props = {
  params: {
    id: string;
  };
};

export default function ZendoroProductPage({ params }: Props) {
  return (
    <main>
      <h1>Zendoro Product</h1>
      <p>{params.id}</p>
    </main>
  );
}
