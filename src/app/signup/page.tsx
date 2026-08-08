import { Signup } from "@/features/auth/ui/signup";

type SignupPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;
  const errorMessage = params?.error;

  return <Signup errorMessage={errorMessage} />;
}
