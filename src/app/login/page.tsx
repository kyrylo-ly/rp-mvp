import { Login } from "@/components/login";
const logo = {
  url: "https://www.shadcnblocks.com",
  src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-wordmark.svg",
  alt: "logo",
  title: "shadcnblocks.com",
};

export default function LoginPage() {
  return <Login logo={logo} />;
}
