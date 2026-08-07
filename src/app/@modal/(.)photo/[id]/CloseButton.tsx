"use client";
import { useRouter } from "next/navigation";

export function CloseButton() {
  const router = useRouter();

  return <button onClick={() => router.back()}>Close</button>;
}
