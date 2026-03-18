"use client";

import { useTheme } from "@/app/providers/ThemeProvider";
import LogoutConfirm from "@/components/shared/LogoutConfirm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { isLocaleSegment } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import {
  FALLBACK_LANGUAGES,
  getLanguageList,
  type LanguageOption,
} from "@/services/language";
import {
  ChevronDown,
  FileText,
  Headphones,
  Heart,
  LayoutGrid,
  LogOut,
  Menu,
  Moon,
  Receipt,
  Settings,
  Sun,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { key: "plans", href: "/plans" },
  { key: "topUp", href: "/top-up" },
  { key: "about", href: "/about-us" },
  { key: "installGuide", href: "/installation-guide" },
  { key: "blog", href: "/blog" },
  { key: "contact", href: "/contact-us" },
];

const MENU_ITEMS = [
  { href: "dashboard", icon: LayoutGrid, label: "dashboard" },
  { href: "my-plans", icon: FileText, label: "myPlans" },
  { href: "favorites", icon: Heart, label: "favorites" },
  // { href: "wallet", icon: Wallet, label: "wallet" },
  { href: "order-billing", icon: Receipt, label: "ordersBilling" },
  { href: "profile-setting", icon: Settings, label: "profileSettings" },
  { href: "support", icon: Headphones, label: "support" },
];

const DEFAULT_LANGUAGE = FALLBACK_LANGUAGES[0]!;

export default function Header(user: {
  name: string;
  email: string;
  id: string;
  profilePicture?: string;
  phone: string;
  country: string;
  location: string;
}) {
  const { toggleTheme, theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Header");

  const [open, setOpen] = useState(false);
  const [languages, setLanguages] =
    useState<LanguageOption[]>(FALLBACK_LANGUAGES);
  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageOption>(DEFAULT_LANGUAGE);

  // const [currencyList, setCurrencyList] = useState<Currency[]>([]);
  // const [currencyModalOpen, setCurrencyModalOpen] = useState(false);
  // const [selectedCurrency, setSelectedCurrency] = useState("USD");
  // const [selectedCountry, setSelectedCountry] = useState("United States");

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const data = await getCurrency();
  //       setCurrencyList(data);
  //       const savedCurrency = await getCurrencyCookie();
  //       const savedCountry = await getCountryCookie();

  //       if (savedCountry) {
  //         setSelectedCountry(savedCountry);
  //       } else if (savedCurrency) {
  //         const found = data.find((c) => c.currency === savedCurrency);
  //         if (found) setSelectedCountry(found.country);
  //       }

  //       if (savedCurrency) setSelectedCurrency(savedCurrency);
  //     } catch (error) {
  //       console.error("Failed to fetch currency:", error);
  //     }
  //   })();
  // }, []);

  useEffect(() => {
    let isMounted = true;

    const loadLanguages = async () => {
      const fetchedLanguages = await getLanguageList();

      if (isMounted) {
        setLanguages(fetchedLanguages);
      }
    };

    loadLanguages();

    return () => {
      isMounted = false;
    };
  }, []);

  // Detect language from URL
  useEffect(() => {
    const parts = pathname.split("/").filter(Boolean);
    const currentLocale = languages.find((lang) => lang.code === parts[0]);
    if (currentLocale) setSelectedLanguage(currentLocale);
  }, [languages, pathname]);

  // Apply dark theme if system preference is dark on initial load (only once)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      // Only apply system preference if no theme is saved
      if (!savedTheme) {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        if (prefersDark && theme !== "dark") {
          toggleTheme();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const handleLanguageChange = (lang: LanguageOption) => {
    setSelectedLanguage(lang);
    const parts = pathname.split("/").filter(Boolean);
    if (isLocaleSegment(parts[0])) parts.shift();
    const newPath = `/${lang.code}/${parts.join("/")}`;
    router.push(newPath);
  };

  return (
    <header className="w-full border-b bg-white text-black dark:bg-gray-900 dark:text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-4">
        {/* Logo */}
        <Link
          href={`/${selectedLanguage?.code}`}
          className="flex items-center gap-2 text-xl font-normal"
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
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang)}
                  className={cn(
                    "cursor-pointer",
                    selectedLanguage?.code === lang.code &&
                      "bg-gradient text-white",
                  )}
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Currency Button */}
          {/* <button
            onClick={() => setCurrencyModalOpen(true)}
            className="flex items-center gap-1 text-sm font-medium outline-none hover:opacity-80 transition cursor-pointer capitalize"
          >
            {selectedCountry}
          </button> */}

          {/* Profile / Auth Section */}
          {user?.id ? (
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
                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    </div>
                  )}
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2">
                {/* User Info Section */}
                <div className="px-3 py-2 mb-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>

                <DropdownMenuSeparator />

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
                  className="text-primary font-normal px-3 cursor-pointer"
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
              className="whitespace-nowrap px-4 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer"
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
                    {languages.map((lang) => (
                      <DropdownMenuItem
                        key={lang.code}
                        className={cn(
                          "cursor-pointer",
                          selectedLanguage?.code === lang.code &&
                            "bg-gradient text-white",
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
                {/* <button
                  onClick={() => {
                    setCurrencyModalOpen(true);
                    setOpen(false);
                  }}
                  className="flex items-center gap-1 text-sm font-medium outline-none hover:opacity-80 transition cursor-pointer uppercase"
                >
                  {selectedCountry}
                </button> */}

                {user?.id ? (
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
                          <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                          </div>
                        )}
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="start" className="w-64 p-2">
                      {/* User Info Section */}
                      <div className="px-3 py-2 mb-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {user.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>

                      <DropdownMenuSeparator />

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
                        className="text-primary font-normal px-3 cursor-pointer"
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
                {theme === "dark" ? (
                  <Moon className="h-5 w-5 text-gray-300 cursor-pointer" />
                ) : (
                  <Sun className="h-5 w-5 text-gray-600 cursor-pointer" />
                )}
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* <CurrencyModal
        open={currencyModalOpen}
        onOpenChange={setCurrencyModalOpen}
        currencies={currencyList}
        selectedCurrency={selectedCurrency}
        onSelect={async (currency) => {
          setSelectedCurrency(currency.currency);
          setSelectedCountry(currency.country);
          await setCurrencyCookie(currency.currency);
          await setCountryCookie(currency.country);
          router.refresh();
        }}
      /> */}
    </header>
  );
}
