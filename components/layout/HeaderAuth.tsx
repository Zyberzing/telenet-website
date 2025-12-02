"use client";

import { useTheme } from "@/app/providers/ThemeProvider";
import {
  ChevronDown,
  FileText,
  Headphones,
  LayoutGrid,
  Menu,
  Moon,
  Receipt,
  Settings,
  ShoppingCart,
  Sun,
  Wallet,
  X,
} from "lucide-react";
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

type Language = {
  code: string;
  name: string;
};

const LANGUAGES: Language[] = [
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
  { code: "es", name: "Español" },
];

const MENU_ITEMS = [
  { href: "dashboard", icon: LayoutGrid, label: "dashboard" },
  { href: "my-plans", icon: FileText, label: "myPlans" },
  { href: "wallet", icon: Wallet, label: "wallet" },
  { href: "order-billing", icon: Receipt, label: "ordersBilling" },
  { href: "profile-setting", icon: Settings, label: "profileSettings" },
  { href: "support", icon: Headphones, label: "support" },
];

export default function HeaderAuth() {
  const t = useTranslations("HeaderAuth");
  const { toggleTheme, theme } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    LANGUAGES[0]!
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const parts = pathname.split("/").filter(Boolean);
    const currentLocale = LANGUAGES.find((l) => l.code === parts[0]);
    if (currentLocale) setSelectedLanguage(currentLocale);
  }, [pathname]);

  const handleLanguageChange = (lang: Language) => {
    setSelectedLanguage(lang);
    const parts = pathname.split("/").filter(Boolean);
    if (LANGUAGES.some((l) => l.code === parts[0])) parts.shift();
    const newPath = `/${lang.code}/${parts.join("/")}`;
    router.push(newPath);
    setMobileLangOpen(false);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="w-full bg-white shadow-sm border-b dark:bg-gray-900 dark:border-gray-700">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href={`/${selectedLanguage.code}/`}
          className="flex items-center gap-2"
          onClick={closeMobileMenu}
        >
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
          {/* Language Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer">
              <button className="flex items-center gap-1 text-sm font-medium outline-none hover:opacity-80 transition">
                <span>{selectedLanguage.code.toUpperCase()}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[6rem]">
              {LANGUAGES.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang)}
                  className="text-sm"
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? (
              <Moon className="h-5 w-5 text-gray-300 cursor-pointer" /> // Show Moon when dark
            ) : (
              <Sun className="h-5 w-5 text-gray-600 cursor-pointer" /> // Show Sun when light
            )}
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white dark:bg-gray-900 px-4 py-4 space-y-4">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setMobileLangOpen(!mobileLangOpen)}
              className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              <span>{selectedLanguage.name}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  mobileLangOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {mobileLangOpen && (
              <div className="absolute left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-50 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-purple-50 dark:hover:bg-gray-700 transition" // Adjust hover for dark mode
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile User Menu Items */}
          <div className="space-y-1 pt-2 border-t dark:border-gray-700">
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={`/${selectedLanguage.code}/${item.href}`}
                onClick={closeMobileMenu}
                className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <item.icon className="h-4 w-4" />
                {t(item.label)}
              </Link>
            ))}
          </div>

          {/* Buy New Plan Button */}
          <Button
            className="w-full bg-primary hover:bg-primary text-white"
            size="default"
            onClick={closeMobileMenu}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {t("buyNewPlan")}
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            className="w-full justify-start"
            size="default"
            onClick={toggleTheme} // Ensure onClick is present for mobile theme toggle
          >
            {theme === "dark" ? (
              <Moon className="h-5 w-5 mr-2 text-gray-300" />
            ) : (
              <Sun className="h-5 w-5 mr-2 text-gray-600" />
            )}
            {t("toggleTheme")}
          </Button>
        </div>
      )}
    </header>
  );
}
