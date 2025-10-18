"use client";

import { useTheme } from "@/app/providers/ThemeProvider";
import { ChevronDown, Menu, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const LANGUAGE = [
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
  { code: "es", name: "Español" },
];

const NAV_ITEMS = [
  { key: "plans", href: "/plans" },
  { key: "topUp", href: "#" },
  { key: "about", href: "/about-us" },
  { key: "installGuide", href: "/installation-guide" },
  { key: "contact", href: "/contact-us" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGE[0]);
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Header");
  const { toggleTheme } = useTheme();

  // Set selected language based on current URL
  useEffect(() => {
    const parts = pathname.split("/").filter(Boolean);
    const currentLocale = LANGUAGE.find((l) => l.code === parts[0]);
    if (currentLocale) setSelectedLanguage(currentLocale);
  }, [pathname]);

  const handleLanguageChange = (lang: any) => {
    setSelectedLanguage(lang);

    const parts = pathname.split("/").filter(Boolean); // remove empty parts

    // Remove first part if it's a valid locale
    if (LANGUAGE.some((l) => l.code === parts[0])) {
      parts.shift();
    }

    // Prepend the selected language
    const newPath = `/${lang.code}/${parts.join("/")}`;
    router.push(newPath);
  };

  return (
    <header className="w-full border-b bg-white text-black dark:bg-gray-900 dark:text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-4">
        <Link
          href={`/${selectedLanguage?.code}`}
          className="flex items-center gap-2 text-xl font-bold"
        >
          <Image src="/logo.svg" alt="Telenet Logo" width={156} height={56} />
        </Link>

        <nav className="hidden lg:flex items-center gap-8 font-medium capitalize">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={`/${selectedLanguage?.code}${item.href}`}
              className="hover:text-primary text-base uppercase font-[400px] dark:hover:text-primary"
            >
              {t(item.key)}
            </Link>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 text-sm font-medium outline-none hover:opacity-80 transition">
                <span>{selectedLanguage?.code.toUpperCase()}</span>
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
                  onClick={() => handleLanguageChange(lang)}
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            onClick={() => router.push(`/${selectedLanguage?.code}/login`)}
            className="cursor-pointer whitespace-nowrap px-4 py-1 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            {t("signIn")}
          </button>

          <button className="justify-start" onClick={toggleTheme}>
            <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Nav */}
      {open && (
        <div className="lg:hidden px-4 py-4 space-y-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={`/${selectedLanguage?.code}${item.href}`}
              className="block hover:text-primary dark:hover:text-primary"
            >
              {t(item.key)}
            </Link>
          ))}

          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => setCountryOpen(!countryOpen)}
              className="flex items-center gap-1 cursor-pointer text-sm px-2 py-1 border rounded border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {selectedLanguage?.name}
            </button>
            {countryOpen && (
              <ul className="absolute left-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-lg z-50 dark:bg-gray-800 dark:border-gray-700">
                {LANGUAGE.map((c) => (
                  <li
                    key={c.code}
                    className="px-4 py-2 hover:bg-primary dark:hover:bg-primary cursor-pointer"
                    onClick={() => handleLanguageChange(c)}
                  >
                    {c.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Sign In */}
          <button
            onClick={() => router.push(`/${selectedLanguage?.code}/login`)}
            className="cursor-pointer whitespace-nowrap px-4 py-1 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            {t("signIn")}
          </button>

          {/* Dark Mode Toggle */}
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </Button>
        </div>
      )}
    </header>
  );
}
