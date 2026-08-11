export const revalidate = false;

import EditClient from './EditClient';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  return <EditClient params={resolvedParams} />;
}
