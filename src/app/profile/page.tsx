type ProfilePageProps = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const params = await searchParams;

  return <div>Profile Page</div>;
}
