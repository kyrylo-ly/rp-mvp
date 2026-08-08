import { Login } from "@/features/auth/ui/login";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const errorMessage = params?.error;

  return <Login errorMessage={errorMessage} />;
}
