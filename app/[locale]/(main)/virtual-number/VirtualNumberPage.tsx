"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useTranslations } from "next-intl";
import Image from "next/image";

// Define the shape of a virtual number
interface VirtualNumber {
  id: string | number;
  number: string;
  duplicate: string | number | boolean;
}

// Define props type
interface VirtualNumberPageProps {
  virtualNumbers: VirtualNumber[];
}

export default function VirtualNumberPage({
  virtualNumbers,
}: VirtualNumberPageProps) {
  const t = useTranslations("VirtualNumber");

  return (
    <div className="w-full min-h-screen bg-white dark:bg-gray-950">
      {/* Banner */}
      <header className="relative w-full h-[13vh] sm:h-[10vh] md:h-[20vh]">
        <Image
          src="/banner-virtual-number.svg"
          alt="Virtual number banner"
          fill
          className="object-cover object-top"
          priority
        />
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="border-0 shadow-sm dark:bg-gray-900 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-[20px] font-normal text-[#141414] dark:text-gray-50 flex items-center">
              {t("numbers")}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <Table className="border-0">
                <TableBody className="border-0">
                  {virtualNumbers.map((item) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors border-0 dark:hover:bg-gray-800"
                    >
                      <TableCell className="px-6 py-3 text-[16px] dark:text-gray-200">
                        {item.number}
                      </TableCell>
                      <TableCell className="px-6 py-3 text-[16px] dark:text-gray-200">
                        {item.duplicate}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
