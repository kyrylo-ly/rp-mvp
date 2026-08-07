interface ShopPageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function ShopPage({ params }: ShopPageProps) {
  const { slug } = await params;

  return <div>SLUG: {slug?.join(", ")}</div>;
}
