"use client";

import { ChevronDown, Menu, Sun, User, X } from "lucide-react";
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

export default function HeaderAuth() {
  const t = useTranslations("HeaderAuth");
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGE[0]);
  const [countryOpen, setCountryOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const parts = pathname.split("/").filter(Boolean);
    const currentLocale = LANGUAGE.find((l) => l.code === parts[0]);
    if (currentLocale) setSelectedLanguage(currentLocale);
  }, [pathname]);

  const handleLanguageChange = (lang: any) => {
    setSelectedLanguage(lang);

    const parts = pathname.split("/").filter(Boolean);

    if (LANGUAGE.some((l) => l.code === parts[0])) {
      parts.shift();
    }

    const newPath = `/${lang.code}/${parts.join("/")}`;
    router.push(newPath);
  };

  return (
    <header className="w-full bg-white shadow-sm px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <Image
            src="/logo.svg"
            alt={t("logoAlt")}
            width={32}
            height={32}
            className="h-8 w-auto"
          />
        </Link>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-6">
          {/* Language Switch */}
          <div className="flex items-center gap-1 cursor-pointer text-sm">
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
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-1 cursor-pointer text-sm">
            <User className="h-4 w-4" />
            <span>{t("userName")}</span>
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
          <div className="flex items-center gap-2 cursor-pointer text-sm">
            <User className="h-4 w-4" />
            <span>{t("userName")}</span>
          </div>
          <Button variant="ghost" size="lg" className="w-full justify-start">
            <Sun className="h-5 w-5 text-gray-600 mr-2" />
            {t("toggleTheme")}
          </Button>
        </div>
      )}
    </header>
  );
}
