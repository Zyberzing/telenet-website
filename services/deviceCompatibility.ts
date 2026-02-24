import { DeviceCompatibilityApiResponse, UsedFor } from "@/lib/types";

const extractValue = (item: unknown, usedFor: UsedFor): string => {
  if (typeof item === "string") return item.trim();
  if (!item || typeof item !== "object") return "";

  const record = item as Record<string, unknown>;

  if (usedFor === "companyName") {
    return String(
      record.companyName ?? record.brand ?? record.name ?? "",
    ).trim();
  }

  return String(record.model ?? record.modelName ?? record.name ?? "").trim();
};

export const getMobileCompanyModelList = async ({
  usedFor,
  companyName,
}: {
  usedFor: UsedFor;
  companyName?: string;
}): Promise<string[]> => {
  const params = new URLSearchParams();
  params.set("usedFor", usedFor);

  if (usedFor === "model" && companyName) {
    params.set("companyName", companyName);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/device-compatibility/get-mobile-company-model-list?${params.toString()}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  const data = (await response
    .json()
    .catch(() => null)) as DeviceCompatibilityApiResponse | null;

  if (!response.ok) {
    throw new Error("Failed to fetch device list");
  }

  const list = data?.data?.result ?? data?.data ?? [];

  if (!Array.isArray(list)) return [];

  return Array.from(
    new Set(
      list
        .map((item) => extractValue(item, usedFor))
        .filter((value) => value.length > 0),
    ),
  );
};
