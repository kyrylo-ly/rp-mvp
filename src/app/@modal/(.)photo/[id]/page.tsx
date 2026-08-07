import { CARS } from "@/app/page";
import { CloseButton } from "./CloseButton";

interface PhotoModalProps {
  params: Promise<{ id: string }>;
}

export default async function PhotoModal({ params }: PhotoModalProps) {
  const { id } = await params;
  const car = CARS.find((c) => c.id === id);
  return (
    <div>
      {" "}
      This is {car?.name} by path /photo/{id} IT IS MODAL
      <CloseButton />
    </div>
  );
}
