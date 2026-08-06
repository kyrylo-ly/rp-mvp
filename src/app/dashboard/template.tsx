"use client";
import Link from "next/link";
import { useState, type ReactNode } from "react";

interface DashboardTemplateProps {
  children: ReactNode;
}

export default function DashboardTemplate({
  children,
}: DashboardTemplateProps) {
  const [text, setText] = useState("text input");
  return (
    <div>
      <aside>
        <div className="mb-8 text-xs font-bold text-blue-500 uppercase tracking-widest font-sans">
          Dashoard Template
        </div>
        <nav className="flex flex-col gap-4">
          <span className="font-bold text-sm text-zinc-400">Navigation</span>
          <Link
            href="/dashboard"
            className="hover:text-blue-600 transition-colors"
          >
            Main
          </Link>
          <Link
            href="/dashboard/settings"
            className="hover:text-blue-600 transition-colors"
          >
            Settings
          </Link>
        </nav>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          name=""
          id=""
        />
      </aside>
      <main className="flex-1 flex flex-col bg-white p-8">{children}</main>
    </div>
  );
}
