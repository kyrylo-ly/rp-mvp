import { authPageLogo } from "@/features/auth/config";
import { loginWithEmailAction } from "@/features/auth/server/actions";
import { AuthForm } from "@/features/auth/ui/auth-form";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const errorMessage = params?.error;

  return (
    <AuthForm
      logo={authPageLogo}
      formAction={loginWithEmailAction}
      errorMessage={errorMessage}
      signupUrl="/signup"
    />
  );
}
