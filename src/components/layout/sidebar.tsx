"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function SideBar() {
  const [text, setText] = useState("textinput");

  const pathname = usePathname();
  const menuItems = [
    { name: "Main", href: "/dashboard" },
    { name: "Settings", href: "/dashboard/settings" },
    { name: "Analytics", href: "/dashboard/analytics" },
  ];

  return (
    <aside className="w-64 bg-blue-50 p-6 border-r border-blue-100 flex flex-col">
      <div className="mb-8 text-xs font-bold text-blue-500 uppercase tracking-widest font-sans">
        Dashoard Layout
      </div>
      <nav className="flex flex-col gap-4">
        <span className="font-bold text-sm text-zinc-400">Navigation</span>
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={index}
              href={item.href}
              className={`transition-colors ${isActive ? "text-blue-600 font-bold" : "hover:text-zinc-400 text-zinc-700"}`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        name=""
        id=""
      />
    </aside>
  );
}
