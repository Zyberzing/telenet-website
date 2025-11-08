import { ContactUs } from "@/app/[locale]/(main)/contact-us/page";
import { fetcher } from "@/lib/fetcher";

export const contactUS = async (body: ContactUs): Promise<any> => {
  const response = await fetcher<{
    status: "success";
    message: string;
  }>("/contact-us/create", {
    method: "POST",
    body,
  });

  if (response?.status !== "success") {
    throw new Error(response?.message || "Failed to contact");
  }

  return response;
};
