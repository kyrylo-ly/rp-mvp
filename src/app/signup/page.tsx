import { signupWithEmailAction } from "@/app/auth-actions";
import { Login } from "@/components/login";

const logo = {
  url: "https://www.shadcnblocks.com",
  src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-wordmark.svg",
  alt: "logo",
  title: "shadcnblocks.com",
};

type SignupPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;
  const errorMessage = params?.error;

  return (
    <Login
      mode="signup"
      heading="Sign up"
      logo={logo}
      buttonText="Create account"
      signupText="Already have an account?"
      signupUrl="/login"
      formAction={signupWithEmailAction}
      errorMessage={errorMessage}
    />
  );
}
