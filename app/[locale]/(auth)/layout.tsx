import HeaderAuth from "@/components/layout/HeaderAuth";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderAuth />
      <main className="flex-grow flex items-center justify-center">
        {children}
      </main>
    </div>
  );
}
