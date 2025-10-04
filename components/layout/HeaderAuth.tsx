"use client";

import { Globe, Menu, Sun, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/Button";

export default function HeaderAuth() {
  const [lang, setLang] = useState("EN");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-sm px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <Image
            src="/logo.png"
            alt="Telenet Logo"
            width={32}
            height={32}
            className="h-8 w-auto"
          />
        </Link>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-6">
          {/* Language Switch */}
          <div className="flex items-center gap-1 cursor-pointer text-sm">
            <Globe className="h-4 w-4" />
            <span>{lang}</span>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-1 cursor-pointer text-sm">
            <User className="h-4 w-4" />
            <span>Alex</span>
          </div>

          {/* Theme Toggle */}
          <Button variant="ghost" size="lg">
            <Sun className="h-5 w-5 text-gray-600" />
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center px-2">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3">
          <div className="flex items-center gap-2 cursor-pointer text-sm">
            <Globe className="h-4 w-4" />
            <span>{lang}</span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer text-sm">
            <User className="h-4 w-4" />
            <span>Alex</span>
          </div>
          <Button variant="ghost" size="lg" className="w-full justify-start">
            <Sun className="h-5 w-5 text-gray-600 mr-2" />
            Toggle Theme
          </Button>
        </div>
      )}
    </header>
  );
}
