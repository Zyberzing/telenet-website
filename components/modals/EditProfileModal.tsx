"use client";

import { User } from "@/app/[locale]/(main)/profile-setting/ProfileSetting";
import { Button } from "@/components/ui/Button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { updateProfile } from "@/services/auth";
import { getCountries } from "@/services/plansApi";
import { Check, ChevronsUpDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function EditProfileModal({
  open,
  onOpenChange,
  user,
  emailAlertEnabled,
  smsAlertEnabled,
  pushNotificationEnabled,
}: {
  open: boolean;
  onOpenChange: (open: boolean, updatedUser?: User) => void;
  user: User;
  emailAlertEnabled: boolean;
  smsAlertEnabled: boolean;
  pushNotificationEnabled: boolean;
}) {
  const t = useTranslations("profile");

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [selectedCountry, setSelectedCountry] = useState(user?.country || "");
  const [selectedLang, setSelectedLang] = useState(user?.lang || "en");
  const [selectedCurrency, setSelectedCurrency] = useState(
    user?.currency || "usd"
  );

  const [countries, setCountries] = useState<{ name: string; id: string }[]>(
    []
  );
  const [countryOpen, setCountryOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchCountries() {
      setLoading(true);
      try {
        const response = await getCountries();
        setCountries(response || []);
      } catch {
        setCountries([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCountries();
  }, []);

  const handleSubmit = async () => {
    setSaving(true);

    const payload: User = {
      ...user,
      name,
      email,
      country: selectedCountry,
      lang: selectedLang,
      currency: selectedCurrency,
      emailAlertEnabled,
      smsAlertEnabled,
      pushNotificationEnabled,
    };

    try {
      const response = await updateProfile(payload);
      toast.success(response.message);
      onOpenChange(false, payload);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Update failed.";

      toast.error(message);
      console.error("Update failed", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onOpenChange(false)}>
      <DialogContent className="sm:max-w-[600px] p-6">
        <DialogHeader className="flex items-start justify-between">
          <DialogTitle className="text-[24px]">{user?.name}</DialogTitle>
          <DialogClose className="text-gray-500 hover:text-gray-700 text-xl cursor-pointer" />
        </DialogHeader>

        <div className="space-y-4">
          {/* NAME */}
          <div>
            <Label>{t("modal.edit.name")}</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          {/* PHONE + EMAIL */}
          <div className="flex gap-3">
            <div className="flex-1">
              <Label>{t("modal.edit.phone")}</Label>
              <Input value={`${user?.countryCode} ${user?.phone}`} readOnly />
            </div>

            <div className="flex-1">
              <Label>{t("modal.edit.email")}</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          {/* COUNTRY + LANGUAGE */}
          <div className="flex gap-3">
            {/* COUNTRY */}
            <div className="flex-1">
              <Label>{t("modal.edit.country")}</Label>

              <Popover
                modal={true}
                open={countryOpen}
                onOpenChange={setCountryOpen}
              >
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <FaSpinner className="animate-spin" />
                        {t("modal.edit.loading") || "Loading..."}
                      </span>
                    ) : (
                      <>
                        {selectedCountry ? selectedCountry : "Select country"}
                        <ChevronsUpDown className="opacity-50" />
                      </>
                    )}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="p-0 w-(--radix-popover-trigger-width)">
                  <Command>
                    <CommandInput
                      placeholder="Search country..."
                      className="h-9"
                    />
                    <CommandList className="max-h-60 overflow-y-auto">
                      {loading ? (
                        <div className="flex items-center justify-center py-6">
                          <FaSpinner className="animate-spin text-gray-500" />
                        </div>
                      ) : (
                        <>
                          <CommandEmpty>No country found.</CommandEmpty>
                          <CommandGroup>
                            {countries.map((c) => {
                              const isSelected = selectedCountry === c.name;
                              return (
                                <CommandItem
                                  key={c.id}
                                  onSelect={() => {
                                    setSelectedCountry(c.name);
                                    setCountryOpen(false);
                                  }}
                                  className={cn(
                                    "cursor-pointer",
                                    isSelected && "bg-gradient text-white"
                                  )}
                                >
                                  {c.name}

                                  <Check
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      isSelected
                                        ? "opacity-100 text-white"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* LANGUAGE */}
            <div className="flex-1">
              <Label>{t("modal.edit.language")}</Label>

              <Select
                defaultValue={selectedLang}
                onValueChange={setSelectedLang}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>

                <SelectContent>
                  {[
                    { value: "en", label: "English" },
                    { value: "es", label: "Spanish" },
                    { value: "fr", label: "French" },
                  ].map((lang) => (
                    <SelectItem
                      key={lang.value}
                      value={lang.value}
                      className="pr-10 data-[state=checked]:text-white data-[state=checked]:bg-gradient"
                    >
                      {lang.label}
                      <Check className="absolute right-2 opacity-0 data-[state=checked]:opacity-100 text-white" />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* CURRENCY */}
          <div>
            <Label>{t("modal.edit.currency")}</Label>

            <Select
              defaultValue={selectedCurrency}
              onValueChange={setSelectedCurrency}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Currency" />
              </SelectTrigger>

              <SelectContent>
                {[
                  { value: "usd", label: "USD" },
                  { value: "inr", label: "INR" },
                  { value: "eur", label: "EUR" },
                ].map((currency) => (
                  <SelectItem
                    key={currency.value}
                    value={currency.value}
                    className="pr-10 data-[state=checked]:text-white data-[state=checked]:bg-gradient"
                  >
                    {currency.label}
                    <Check className="absolute right-2 opacity-0 data-[state=checked]:opacity-100 text-white" />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-4 mt-6">
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            className="bg-black dark:bg-gray-700"
          >
            {t("modal.edit.cancel")}
          </Button>

          <Button
            className="bg-primary text-white hover:text-white"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? (
              <FaSpinner className="animate-spin" />
            ) : (
              t("modal.edit.submit")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
