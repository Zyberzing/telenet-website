"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { crateTicket } from "@/services/ticket";
import { uploadMedia } from "@/services/upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  // name: z.string().min(1),
  // email: z.string().email(),
  // phoneNumber: z.string().min(5),
  // countryCode: z.string().min(1),
  subject: z.string().min(1),
  category: z.string().min(1),
  // priority: z.string().min(1),
  description: z.string().min(1),
});

interface CreateTicketModalProps {
  isNewTicketOpen: boolean;
  setIsNewTicketOpen: (open: boolean) => void;
}

export default function CreateTicketModal({
  isNewTicketOpen,
  setIsNewTicketOpen,
}: CreateTicketModalProps) {
  const t = useTranslations("Support");
  // const [openCountry, setOpenCountry] = useState(false);
  // const countryCodes = getCountries().map((country) => ({
  //   code: `+${getCountryCallingCode(country)}`,
  //   country,
  // }));

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema as any),
    defaultValues: {
      // name: "",
      // email: "",
      // phoneNumber: "",
      // countryCode: "",
      subject: "",
      category: "",
      // priority: "",
      description: "",
    },
  });

  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isNewTicketOpen) {
      form.reset();
      setFile(null);
    }
  }, [isNewTicketOpen, form]);

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      setIsSubmitting(true);

      let fileUrl: string | null = null;

      if (file) {
        const fd = new FormData();
        fd.append("file", file);

        const uploaded = await uploadMedia(fd);
        fileUrl = uploaded?.data?.httpsUrl ?? null;
      }

      const payload = {
        // name: values.name,
        // email: values.email,
        // countryCode: values.countryCode,
        // phoneNumber: values.phoneNumber,
        subject: values.subject,
        description: values.description,
        category: values.category,
        // priority: values.priority,
        // document: fileUrl,
      };
      const response = await crateTicket(payload);
      toast.success(response.message || "Ticket created successfully");
      setIsNewTicketOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen}>
      <DialogContent
        className="max-w-md max-h-[85vh] flex flex-col"
        showCloseButton={false}
      >
        <div className="flex justify-between">
          <DialogTitle className="content-center">
            {t("raiseTicket")}
          </DialogTitle>
          <button
            onClick={() => setIsNewTicketOpen(false)}
            className="text-gray-500 hover:text-red-500 text-3xl cursor-pointer"
          >
            &times;
          </button>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 overflow-y-auto px-2"
          >
            {/* NAME */}
            {/* <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("name")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("placeholderName")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            {/* EMAIL */}
            {/* <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("placeholderEmail")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            {/* PHONE + COUNTRY CODE */}
            {/* <div className="flex gap-3">
              <FormField
                control={form.control}
                name="countryCode"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>{t("countryCodeLabel")}</FormLabel>
                    <Popover
                      modal={true}
                      open={openCountry}
                      onOpenChange={setOpenCountry}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              <span>
                                {
                                  countryCodes.find(
                                    (item) => item.code === field.value,
                                  )?.country
                                }{" "}
                                {field.value}
                              </span>
                            ) : (
                              <span>{t("countryCodePlaceholder")}</span>
                            )}

                            <ChevronsUpDown className="h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>

                      <PopoverContent className="w-(--radix-popover-trigger-width) h-56 p-0">
                        <Command>
                          <CommandInput placeholder={t("searchCountry")} />
                          <CommandEmpty>{t("noCountryFound")}</CommandEmpty>
                          <CommandGroup className="max-h-[300px] overflow-y-auto">
                            {countryCodes.map(({ country, code }) => (
                              <CommandItem
                                key={country}
                                value={`${country} ${code}`} // <-- SEARCH WORKS BY NAME & CODE
                                onSelect={() => {
                                  field.onChange(code); // form value stays just +91
                                  setOpenCountry(false); // <-- AUTO CLOSE FIX
                                }}
                              >
                                <ReactCountryFlag
                                  svg
                                  countryCode={country}
                                  // className="mr-2"
                                />
                                {country} ({code})
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    field.value === code
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="flex-[2]">
                    <FormLabel>{t("phone")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("placeholderPhone")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div> */}

            {/* SUBJECT */}
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("subject")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("placeholderSubject")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CATEGORY */}
            <div className="flex gap-2">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("category")}</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={t("selectCategory")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="activation">
                            {t("activation")}
                          </SelectItem>
                          <SelectItem value="refund">{t("refund")}</SelectItem>
                          <SelectItem value="billing">
                            {t("billing")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* <div className="flex-1">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("priority")}</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={t("low")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">{t("low")}</SelectItem>
                          <SelectItem value="medium">{t("medium")}</SelectItem>
                          <SelectItem value="high">{t("high")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div> */}
            </div>

            {/* DESCRIPTION */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("description")}</FormLabel>
                  <FormControl>
                    <textarea
                      rows={3}
                      className="w-full border rounded-md p-2"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* FILE UPLOAD */}
            {/* <div>
              <Label className="block mb-1">{t("attachFile")}</Label>

              <div className="flex gap-3">
                <div>
                  <input
                    key={file ? file.name : "empty"}
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <Button
                    type="button"
                    onClick={() =>
                      document.getElementById("file-upload")?.click()
                    }
                  >
                    {file ? file.name : t("upload")}
                  </Button>
                </div>

                {file && (
                  <div className="relative border rounded-md p-2 max-w-[50%] max-h-[50%] overflow-hidden">
                    <button
                      onClick={() => setFile(null)}
                      className="absolute top-0.5 right-0.5 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow cursor-pointer z-10"
                    >
                      ✕
                    </button>

                    {file.type.startsWith("image/") ? (
                      <Image
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        width={200}
                        height={200}
                        unoptimized
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="text-xs text-center break-words">
                        <p className="font-semibold">{file.name}</p>
                        <p className="text-gray-500">{file.type}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div> */}

            <DialogFooter className="mt-4 justify-center">
              <Button
                type="submit"
                className="py-6 bg-primary text-white w-1/2 rounded-full"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? t("submittingTicket") : t("submitTicket")}
                {/* {t("submitTicket")} */}
              </Button>
              <Button
                type="button"
                className="py-6 bg-black text-white w-1/2 rounded-full"
                onClick={() => setIsNewTicketOpen(false)}
              >
                {t("cancel")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
