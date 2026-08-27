export const revalidate = false;

import SlugClient from "./SlugClient";

export default function Page({
  params,
}: {
  params: { slug: string };
}) {
  return <SlugClient params={params} />;
}

