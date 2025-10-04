import HeaderAuth from "@/components/layout/HeaderAuth";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <HeaderAuth />
        <main className="flex-grow flex items-center justify-center">
          {children}
        </main>
      </body>
    </html>
  );
}
