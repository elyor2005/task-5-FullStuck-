// components/NavBar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // for icons (lucide-react is lightweight)

const NavBar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    // { href: "/admin", label: "Users", type: "link" },
    { href: "/login", label: "Login", type: "button-outline" },
    { href: "/register", label: "Register", type: "button-solid" },
  ];

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-500 transition">
          The App
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4 items-center">
          {links.map((link) =>
            link.type === "link" ? (
              <Link key={link.href} href={link.href} className={`hover:text-blue-400 transition ${pathname === link.href ? "text-blue-500 font-semibold" : ""}`}>
                {link.label}
              </Link>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg font-medium transition 
                  ${link.type === "button-solid" ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md" : "border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"}`}
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 text-gray-300 hover:text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col text-center gap-3">
          {links.map((link) =>
            link.type === "link" ? (
              <Link key={link.href} href={link.href} className={`hover:text-blue-400 transition ${pathname === link.href ? "text-blue-500 font-semibold" : ""}`} onClick={() => setIsOpen(false)}>
                {link.label}
              </Link>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg font-medium transition text-center
                  ${link.type === "button-solid" ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md" : "border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"}`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            )
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
