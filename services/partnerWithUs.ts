import { PartnerWithUs } from "@/app/[locale]/(main)/partner-with-us/page";
import { fetcher } from "@/lib/fetcher";

export const partnerWithUs = async (body: PartnerWithUs): Promise<any> => {
    const response = await fetcher<{
        status: "success";
        message: string;
    }>("/partner/create", {
        method: "POST",
        body,
    });

    if (response?.status !== "success") {
        throw new Error(response?.message || "Failed to partner with us");
    }

    return response;
};
