import { notFound } from "next/navigation";

export default function SettingsPage() {
  const data = 1;
  if (!data) notFound();
  return (
    <div className="p-4 bg-zinc-50 border-2 border-zinc-500 rounded-md">
      <h1 className="text-xl font-bold text-black">Content Page Settings</h1>
      <p>This page path: /dashboard/settings</p>
    </div>
  );
}
