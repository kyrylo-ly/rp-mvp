import Link from "next/link";

export const CARS = [
  { id: "1", name: "Porsche" },
  { id: "2", name: "BMW" },
  { id: "3", name: "Audi" },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      Home Page Garage
      <div>
        {CARS.map((car) => (
          <Link
            className="p-6 hover:text-blue-500"
            key={car.id}
            href={`/photo/${car.id}`}
          >
            {car.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
