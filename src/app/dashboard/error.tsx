"use client";

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  return (
    <div>
      Error in dashboard{" "}
      <div>
        {error.message}
        <button onClick={() => reset()}>Try again</button>
      </div>
    </div>
  );
}
