import { authPageLogo } from "@/features/auth/config";
import { signupWithEmailAction } from "@/features/auth/server/actions";
import { AuthForm } from "@/features/auth/ui/auth-form";

type SignupPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;
  const errorMessage = params?.error;

  return (
    <AuthForm
      mode="signup"
      heading="Sign up"
      logo={authPageLogo}
      buttonText="Create account"
      signupText="Already have an account?"
      signupUrl="/login"
      formAction={signupWithEmailAction}
      errorMessage={errorMessage}
    />
  );
}
