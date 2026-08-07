import { CARS } from "@/app/page";
import { notFound } from "next/navigation";

interface PhotoPageProps {
  params: Promise<{ id: string }>;
}

export default async function PhotoPage({ params }: PhotoPageProps) {
  const { id } = await params;
  const car = CARS.find((c) => c.id === id);
  if (!car) return notFound();
  return <div>You see the car with ID: {id}</div>;
}
