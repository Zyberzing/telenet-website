"use client";

import { ROUTES } from "@/routes";
import { ChevronDown, Globe, Menu, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const LANGUAGE = [
  { code: "EN", name: "English" },
  { code: "FR", name: "Français" },
  { code: "ES", name: "Español" },
  { code: "DE", name: "Deutsch" },
];

const NAV_ITEMS = [
  { label: "Plans", href: "/plans" },
  { label: "Top Up & Recharge", href: "#" },
  { label: "About us", href: "#" },
  { label: "Installation guide", href: "#" },
  { label: "Contact Us", href: "/contact-us" },
];
export default function Header({ isDarkMode, setIsDarkMode }: any) {
  const [open, setOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGE[0]);
  const router = useRouter();

  return (
    <header className="w-full border-b bg-white text-black dark:bg-gray-900 dark:text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Image
            src="/logo.svg"
            alt="Telenet Logo"
            width={156}
            height={56}
            // className="h-8 w-auto"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 font-medium capitalize">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-primary text-base uppercase font-medium dark:hover:text-primary"
            >
              {item.label}
            </Link>
          ))}

          {/* Country Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 text-sm font-medium outline-none hover:opacity-80 transition">
                <span>{selectedLanguage?.code}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="min-w-[6rem] bg-white dark:bg-gray-900 text-sm shadow-lg rounded-md"
            >
              {LANGUAGE.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`cursor-pointer ${
                    selectedLanguage?.code === lang.code
                      ? "bg-gray-100 dark:bg-gray-800"
                      : ""
                  }`}
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sign In */}
          <button
            onClick={() => router.push(ROUTES.LOGIN)}
            className="cursor-pointer whitespace-nowrap px-4 py-1 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            SIGN IN
          </button>

          <button
            className="justify-start"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Nav */}
      {open && (
        <div className="md:hidden px-4 py-4 space-y-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <Link
            href={ROUTES.PLANS}
            className="block hover:text-primary dark:hover:text-primary"
          >
            Plans
          </Link>
          <Link
            href="#"
            className="block hover:text-primary dark:hover:text-primary"
          >
            Top Up & Recharge
          </Link>
          <Link
            href="#"
            className="block hover:text-primary dark:hover:text-primary"
          >
            Installation guide
          </Link>
          <Link
            href={ROUTES.CONTACT_US}
            className="block hover:text-primary dark:hover:text-primary"
          >
            Contact Us
          </Link>

          {/* Country selector */}
          <div className="relative">
            <button
              onClick={() => setCountryOpen(!countryOpen)}
              className="flex items-center gap-1 cursor-pointer text-sm px-2 py-1 border rounded border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Globe className="h-4 w-4" />
              {selectedLanguage?.name}
            </button>
            {countryOpen && (
              <ul className="absolute left-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-lg z-50 dark:bg-gray-800 dark:border-gray-700">
                {LANGUAGE.map((c) => (
                  <li
                    key={c.code}
                    className="px-4 py-2 hover:bg-primary dark:hover:bg-primary cursor-pointer"
                    onClick={() => {
                      setSelectedLanguage(c);
                      setCountryOpen(false);
                    }}
                  >
                    {c.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={() => router.push(ROUTES.LOGIN)}
            className="cursor-pointer whitespace-nowrap px-4 py-1 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            SIGN IN
          </button>

          <Button variant="ghost" size="sm" className="w-full justify-start">
            <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </Button>
        </div>
      )}
    </header>
  );
}
