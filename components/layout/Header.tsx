"use client";

import { useTheme } from "@/app/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import { RootState } from "@/store/Store";
import {
  ChevronDown,
  FileText,
  Headphones,
  LayoutGrid,
  LogOut,
  Menu,
  Moon,
  Receipt,
  Settings,
  Sun,
  User,
  Wallet,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LogoutConfirm from "../shared/LogoutConfirm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const LANGUAGE = [
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
  { code: "es", name: "Español" },
];

const NAV_ITEMS = [
  { key: "plans", href: "/plans" },
  { key: "topUp", href: "/top-up" },
  { key: "about", href: "/about-us" },
  { key: "installGuide", href: "/installation-guide" },
  { key: "contact", href: "/contact-us" },
];

const MENU_ITEMS = [
  { href: "dashboard", icon: LayoutGrid, label: "dashboard" },
  { href: "my-plans", icon: FileText, label: "myPlans" },
  { href: "wallet", icon: Wallet, label: "wallet" },
  { href: "order-billing", icon: Receipt, label: "ordersBilling" },
  { href: "profile-setting", icon: Settings, label: "profileSettings" },
  { href: "support", icon: Headphones, label: "support" },
];

type Language = (typeof LANGUAGE)[number];

export default function Header() {
  const { toggleTheme, theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Header");

  const [open, setOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGE[0]);
  // const [user, setUser] = useState<any | null>(null);

  // useEffect(() => {
  //   async function fetchUser() {
  //     const profile = await getProfile();
  //     setUser(profile);
  //   }
  //   fetchUser();
  // }, []);
  const { user } = useSelector((state: RootState) => state.auth);
  // Detect language from URL
  useEffect(() => {
    const parts = pathname.split("/").filter(Boolean);
    const currentLocale = LANGUAGE.find((l) => l.code === parts[0]);
    if (currentLocale) setSelectedLanguage(currentLocale);
  }, [pathname]);

  // Apply dark theme if system preference is dark on initial load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (prefersDark && theme !== "dark") {
        toggleTheme();
      }
    }
  }, [toggleTheme, theme]);

  const handleLanguageChange = (lang: Language) => {
    setSelectedLanguage(lang);
    const parts = pathname.split("/").filter(Boolean);
    if (LANGUAGE.some((l) => l.code === parts[0])) parts.shift();
    const newPath = `/${lang.code}/${parts.join("/")}`;
    router.push(newPath);
  };

  return (
    <header className="w-full border-b bg-white text-black dark:bg-gray-900 dark:text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-4">
        {/* Logo */}
        <Link
          href={`/${selectedLanguage?.code}`}
          className="flex items-center gap-2 text-xl font-[400]"
        >
          <Image src="/logo.svg" alt="Telenet Logo" width={156} height={56} />
        </Link>

        {/* Desktop Navigation */}
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

          {/* Language Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 text-sm font-medium outline-none hover:opacity-80 transition cursor-pointer">
                <span>{selectedLanguage?.code.toUpperCase()}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="min-w-[6rem] text-sm cursor-pointer"
            >
              {LANGUAGE.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang)}
                  className={cn(
                    "cursor-pointer",
                    selectedLanguage?.code === lang.code &&
                      "bg-gradient text-white"
                  )}
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile / Auth Section */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 cursor-pointer">
                  {user?.profilePicture ? (
                    <Image
                      src={user.profilePicture}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                  )}
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 p-2">
                <div className="space-y-1">
                  {MENU_ITEMS.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link
                        href={`/${selectedLanguage?.code}/${item.href}`}
                        className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
                      >
                        <item.icon className="h-4 w-4" />
                        {t(item.label)}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="text-primary font-[400] px-3 cursor-pointer"
                >
                  <LogoutConfirm className="flex gap-3">
                    <LogOut className="h-4 w-4" />
                    {t("logout")}
                  </LogoutConfirm>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              onClick={() => router.push(`/${selectedLanguage?.code}/login`)}
              className="cursor-pointer whitespace-nowrap px-4 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer"
            >
              {t("signIn")}
            </button>
          )}

          {/* Theme Toggle */}
          <button onClick={toggleTheme}>
            {theme === "dark" ? (
              <Moon className="h-5 w-5 text-gray-300 cursor-pointer" /> // Show Moon when dark
            ) : (
              <Sun className="h-5 w-5 text-gray-600 cursor-pointer" /> // Show Sun when light
            )}
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* 👇 MOBILE MENU SECTION 👇 */}
      {open && (
        <div className="lg:hidden border-t bg-white dark:bg-gray-900">
          <nav className="flex flex-col p-4 space-y-3 text-base">
            {/* Links */}
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={`/${selectedLanguage?.code}${item.href}`}
                className="hover:text-primary uppercase"
                onClick={() => setOpen(false)}
              >
                {t(item.key)}
              </Link>
            ))}

            {/* Language & Theme */}
            <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-800">
              <div className="flex gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 text-sm font-medium outline-none hover:opacity-80 transition cursor-pointer">
                      <span>{selectedLanguage?.code.toUpperCase()}</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="min-w-[6rem] text-sm cursor-pointer"
                  >
                    {LANGUAGE.map((lang) => (
                      <DropdownMenuItem
                        key={lang.code}
                        className={cn(
                          "cursor-pointer",
                          selectedLanguage?.code === lang.code &&
                            "bg-gradient text-white"
                        )}
                        onClick={() => {
                          handleLanguageChange(lang);
                          setOpen(false);
                        }}
                      >
                        {lang.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2">
                        {user?.profilePicture ? (
                          <Image
                            src={user.profilePicture}
                            alt="Profile"
                            width={36}
                            height={36}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-600" />
                          </div>
                        )}
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="start" className="w-56 p-2">
                      <div className="space-y-1">
                        {MENU_ITEMS.map((item) => (
                          <DropdownMenuItem key={item.href} asChild>
                            <Link
                              href={`/${selectedLanguage?.code}/${item.href}`}
                              onClick={() => setOpen(false)}
                              className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
                            >
                              <item.icon className="h-4 w-4" />
                              {t(item.label)}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </div>

                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        // onClick={() => {
                        //   handleLogout();
                        //   setOpen(false);
                        // }}
                        className="text-primary font-[400] px-3 cursor-pointer"
                      >
                        <LogoutConfirm className="flex gap-3">
                          <LogOut className="h-4 w-4" />
                          {t("logout")}
                        </LogoutConfirm>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <button
                    onClick={() => {
                      router.push(`/${selectedLanguage?.code}/login`);
                      setOpen(false);
                    }}
                    className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                  >
                    {t("signIn")}
                  </button>
                )}
              </div>
              <button onClick={toggleTheme}>
                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300 cursor-pointer" />
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
