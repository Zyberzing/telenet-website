"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useTranslations } from "next-intl";
import Image from "next/image";

const virtualNumbers = [
  { id: 1, number: "4455 14612", duplicate: "4455 14612" },
  { id: 2, number: "5566 6542", duplicate: "5566 6542" },
  { id: 3, number: "3355 1546", duplicate: "3355 1546" },
  { id: 4, number: "6420 5420", duplicate: "6420 5420" },
  { id: 5, number: "6584 0215", duplicate: "6584 0215" },
];

export default function VirtualNumberPage() {
  const t = useTranslations("VirtualNumber");

  return (
    <div className="w-full min-h-screen bg-white">
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
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-[20px] font-[400px] text-[#141414] flex items-center">
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
                      className="hover:bg-gray-50 transition-colors border-0"
                    >
                      <TableCell className="px-6 py-3 text-[16px]">
                        {item.number}
                      </TableCell>
                      <TableCell className="px-6 py-3 text-[16px]">
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
