"use client";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored === "true") setIsDarkMode(true);
  }, []);

  React.useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode ? "true" : "false");
  }, [isDarkMode]);

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
