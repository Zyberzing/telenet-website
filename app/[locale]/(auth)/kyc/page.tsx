"use client";

import { Button } from "@/components/ui/Button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Input } from "@/components/ui/Input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  defaultManualForm,
  KycMethod,
  ManualDocumentType,
  ManualFilePreview,
  ManualKycForm,
  RegistrationState,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/routes";
import { getProfile } from "@/services/auth";
import { getKYC, submitManualKycWithToken } from "@/services/kyc";
import { uploadPublicMedia } from "@/services/upload";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import { Check, ChevronsUpDown } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { toast } from "sonner";

declare global {
  interface Window {
    snsWebSdk: any;
  }
}

const MAX_MANUAL_FILES = 3;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_FILE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "heic", "pdf"];
const ALLOWED_FILE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "application/pdf",
]);
const ALLOWED_FILE_EXTENSION_SET = new Set(ALLOWED_FILE_EXTENSIONS);
const FILE_INPUT_ACCEPT = ALLOWED_FILE_EXTENSIONS.map((ext) => `.${ext}`).join(
  ",",
);
type ManualFormErrors = Partial<Record<keyof ManualKycForm | "files", string>>;

export default function KYC() {
  const locale = useLocale();
  const router = useRouter();
  const [method, setMethod] = useState<KycMethod | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [kycCompleted, setKycCompleted] = useState(false);
  const [loadingToken, setLoadingToken] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [manualForm, setManualForm] =
    useState<ManualKycForm>(defaultManualForm);
  const [manualFiles, setManualFiles] = useState<File[]>([]);
  const [manualFilePreviews, setManualFilePreviews] = useState<
    ManualFilePreview[]
  >([]);
  const [manualSubmitting, setManualSubmitting] = useState(false);
  const [registrationState, setRegistrationState] =
    useState<RegistrationState | null>(null);
  const [selectedCountryIso, setSelectedCountryIso] = useState("");
  const [manualErrors, setManualErrors] = useState<ManualFormErrors>({});
  const fullNameRef = useRef<HTMLInputElement>(null);
  const dateOfBirthRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const countryTriggerRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const countryCodes = useMemo(() => {
    const regionNames = new Intl.DisplayNames([locale], {
      type: "region",
    });

    return getCountries().map((country) => ({
      iso: country,
      name: regionNames.of(country) ?? country,
      code: `+${getCountryCallingCode(country)}`,
    }));
  }, [locale]);

  const methodTitle = useMemo(() => {
    if (method === "sumsub") return "Sumsub Verification";
    if (method === "manual") return "Manual KYC Verification";
    return "Choose Verification Method";
  }, [method]);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("sumsub_kyc_token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    try {
      const regRaw =
        sessionStorage.getItem("registrationState") ||
        localStorage.getItem("registrationState");

      if (!regRaw) return;

      const parsed = JSON.parse(regRaw) as RegistrationState;
      setRegistrationState(parsed);

      const selectedCountry =
        (parsed?.countryIso &&
          countryCodes.find((item) => item.iso === parsed.countryIso)) ||
        (parsed?.country &&
          countryCodes.find(
            (item) => item.name.toLowerCase() === parsed.country?.toLowerCase(),
          )) ||
        countryCodes.find((item) => item.code === parsed?.countryCode);

      setManualForm((prev) => ({
        ...prev,
        fullName: parsed?.name || prev.fullName,
        country: selectedCountry?.name || prev.country,
        countryCode: parsed?.countryCode || prev.countryCode,
      }));
      setSelectedCountryIso(selectedCountry?.iso || "");
    } catch {
      // Ignore parsing issues and keep manual entry available.
    }
  }, [countryCodes]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setProfileLoading(true);
        const profile = await getProfile();

        const profileCountryCode =
          profile?.countryCode || registrationState?.countryCode;
        const selectedCountry =
          (profile?.country &&
            countryCodes.find(
              (item) =>
                item.name.toLowerCase() === profile.country?.toLowerCase(),
            )) ||
          (registrationState?.countryIso &&
            countryCodes.find(
              (item) => item.iso === registrationState.countryIso,
            )) ||
          countryCodes.find((item) => item.code === profileCountryCode);

        setManualForm((prev) => ({
          ...prev,
          fullName: profile?.name || prev.fullName,
          address: profile?.address || prev.address,
          country: selectedCountry?.name || profile?.country || prev.country,
          countryCode:
            selectedCountry?.code || profileCountryCode || prev.countryCode,
        }));
        setSelectedCountryIso(selectedCountry?.iso || "");
      } catch {
        // Keep static flow functional even if profile fetch is unavailable.
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, [
    countryCodes,
    registrationState?.countryCode,
    registrationState?.countryIso,
  ]);

  useEffect(() => {
    if (method !== "sumsub" || token) return;

    const fetchSumsubToken = async () => {
      if (!registrationState?.otpAccessToken) {
        setLoadingToken(false);
        return;
      }

      try {
        setLoadingToken(true);
        const kycRes = (await getKYC({
          accessToken: registrationState.otpAccessToken,
          refreshToken: registrationState.otpRefreshToken,
        })) as { data?: { token?: string } } | null;
        const fetchedToken = kycRes?.data?.token || null;

        if (!fetchedToken) return;

        setToken(fetchedToken);
        sessionStorage.setItem("sumsub_kyc_token", fetchedToken);
      } catch {
        // Token can fail for users without an auth session; keep UI visible.
      } finally {
        setLoadingToken(false);
      }
    };

    fetchSumsubToken();
  }, [
    method,
    token,
    registrationState?.otpAccessToken,
    registrationState?.otpRefreshToken,
  ]);

  useEffect(() => {
    if (method !== "sumsub" || !token) return;

    const script = document.createElement("script");
    script.src =
      "https://static.sumsub.com/idensic/static/sns-websdk-builder.js";
    script.async = true;
    script.onload = () => {
      if (!window.snsWebSdk) return;

      const snsWebSdkInstance = window.snsWebSdk
        .init(token, async () => {
          const newToken = await fetch("/api/get-new-sumsub-token").then(
            (res) => res.text(),
          );
          return newToken;
        })
        .withConf({
          lang: "en",
          theme: "light",
        })
        .withOptions({
          addViewportTag: false,
          adaptIframeHeight: true,
        })
        .on("idCheck.onStepCompleted", (payload: any) => {
          if (payload.reviewResult?.reviewAnswer === "GREEN") {
            setKycCompleted(true);
          }
        })
        .on("idCheck.onApplicantSubmitted", () => {
          setKycCompleted(true);
        })
        .on("idCheck.onError", () => {
          toast.error("KYC failed. Please try again.");
        })
        .build();

      snsWebSdkInstance.launch("#sumsub-websdk-container");
    };

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [method, token]);

  const validateManualField = (
    key: keyof ManualKycForm | "files",
    formValue: ManualKycForm,
    files: File[],
  ) => {
    if (key === "fullName")
      return formValue.fullName.trim() ? "" : "Full name is required.";
    if (key === "dateOfBirth")
      return formValue.dateOfBirth ? "" : "Date of birth is required.";
    if (key === "address")
      return formValue.address.trim() ? "" : "Address is required.";
    if (key === "countryCode")
      return formValue.countryCode ? "" : "Country is required.";
    if (key === "files")
      return files.length > 0 ? "" : "At least one document is required.";
    return "";
  };

  const handleManualChange = (key: keyof ManualKycForm, value: string) => {
    setManualForm((prev) => {
      const next = { ...prev, [key]: value };
      if (manualErrors[key]) {
        const message = validateManualField(key, next, manualFiles);
        setManualErrors((current) => ({
          ...current,
          [key]: message,
        }));
      }
      return next;
    });
  };

  const handleManualFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    event.target.value = "";

    if (selectedFiles.length === 0) return;

    const invalidFormatFile = selectedFiles.find((file) => {
      const extension = file.name.split(".").pop()?.toLowerCase() || "";
      const isExtensionAllowed = ALLOWED_FILE_EXTENSION_SET.has(extension);
      const mimeType = file.type.toLowerCase();
      const isMimeAllowed =
        mimeType.length === 0 || ALLOWED_FILE_MIME_TYPES.has(mimeType);
      return !isExtensionAllowed || !isMimeAllowed;
    });

    if (invalidFormatFile) {
      const message =
        "Invalid format. Allowed: JPG, PNG, JPEG, WEBP, HEIC, PDF.";
      setManualErrors((prev) => ({ ...prev, files: message }));
      toast.error(message);
      return;
    }

    const oversizedFile = selectedFiles.find(
      (file) => file.size > MAX_FILE_SIZE_BYTES,
    );

    if (oversizedFile) {
      const message = "Each file must be 10MB or smaller.";
      setManualErrors((prev) => ({ ...prev, files: message }));
      toast.error(message);
      return;
    }

    setManualFiles((prev) => {
      const merged = [...prev, ...selectedFiles];
      const unique = merged.filter(
        (file, index, arr) =>
          arr.findIndex(
            (item) =>
              item.name === file.name &&
              item.size === file.size &&
              item.lastModified === file.lastModified,
          ) === index,
      );

      const exceedsMax = unique.length > MAX_MANUAL_FILES;
      const fileMessage = exceedsMax
        ? "You can upload a maximum of 3 files."
        : "";
      setManualErrors((current) => ({ ...current, files: fileMessage }));
      if (exceedsMax) toast.error(fileMessage);

      return unique.slice(0, MAX_MANUAL_FILES);
    });
  };

  const removeManualFile = (targetIndex: number) => {
    setManualFiles((prev) => {
      const updated = prev.filter((_, index) => index !== targetIndex);
      setManualErrors((current) => ({
        ...current,
        files: validateManualField("files", manualForm, updated),
      }));
      return updated;
    });
  };

  useEffect(() => {
    const previews = manualFiles.map((file) => ({
      name: file.name,
      type: file.type,
      previewUrl: URL.createObjectURL(file),
    }));

    setManualFilePreviews(previews);

    return () => {
      previews.forEach((file) => URL.revokeObjectURL(file.previewUrl));
    };
  }, [manualFiles]);

  const handleManualSubmit = async () => {
    const nextErrors: ManualFormErrors = {
      fullName: validateManualField("fullName", manualForm, manualFiles),
      dateOfBirth: validateManualField("dateOfBirth", manualForm, manualFiles),
      address: validateManualField("address", manualForm, manualFiles),
      countryCode: validateManualField("countryCode", manualForm, manualFiles),
      files: validateManualField("files", manualForm, manualFiles),
    };
    setManualErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      if (nextErrors.fullName) {
        fullNameRef.current?.focus();
      } else if (nextErrors.dateOfBirth) {
        dateOfBirthRef.current?.focus();
      } else if (nextErrors.address) {
        addressRef.current?.focus();
      } else if (nextErrors.countryCode) {
        countryTriggerRef.current?.focus();
      } else if (nextErrors.files) {
        fileInputRef.current?.focus();
      }
      return;
    }

    // if (
    //   manualForm.documentType === "other" &&
    //   !manualForm.otherDocumentName.trim()
    // ) {
    //   toast.error("Please enter your other document name.");
    //   return;
    // }

    try {
      setManualSubmitting(true);

      if (!registrationState?.otpAccessToken) {
        throw new Error("KYC session expired. Please verify OTP again.");
      }
      const otpAccessToken = registrationState.otpAccessToken;

      const uploadPromises = manualFiles.map(async (file) => {
        const formData = new FormData();
        formData.append("files", file);
        const uploaded = await uploadPublicMedia(formData, {
          accessToken: otpAccessToken,
          refreshToken: registrationState.otpRefreshToken,
        });

        const uploadedUrl =
          uploaded?.data?.[0]?.httpsUrl ||
          uploaded?.data?.[0]?.url ||
          uploaded?.data?.[0]?.fileUrl;

        if (!uploadedUrl) {
          throw new Error("Failed to upload document.");
        }

        return uploadedUrl as string;
      });

      const documentUrls = await Promise.all(uploadPromises);
      const selectedDocType =
        // manualForm.documentType === "other"
        //   ? manualForm.otherDocumentName.trim()
        manualForm.documentType;

      const payload = {
        fullName: manualForm.fullName.trim(),
        dateOfBirth: manualForm.dateOfBirth,
        address: manualForm.address.trim(),
        country: manualForm.country.trim(),
        documentUrls: documentUrls.map((url) => ({
          documentType: selectedDocType,
          documentUrl: url,
        })),
      };
      console.log("Submitting manual KYC with payload:", payload);
      const response = await submitManualKycWithToken(payload, {
        accessToken: registrationState.otpAccessToken,
        refreshToken: registrationState.otpRefreshToken,
      });
      toast.success(
        response?.message ||
          "Manual KYC submitted. Your status is pending review.",
      );
      router.push(ROUTES.LOGIN(locale));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to submit manual KYC.";
      toast.error(message);
    } finally {
      setManualSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col p-3 bg-gray-100 dark:bg-gray-950">
      <main className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-5xl rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm dark:shadow-xl dark:shadow-gray-800 p-6">
          <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
            {methodTitle}
          </h1>
          {/* <p className="text-sm text-gray-500 mt-1">
          Register -> Verify OTP -> KYC -> Login (approved users only)
        </p> */}

          {!method && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <button
                type="button"
                className="text-left border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-primary transition cursor-pointer bg-white dark:bg-gray-800"
                onClick={() => setMethod("manual")}
              >
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  Manual KYC
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                  Upload your document and submit details for review.
                </p>
              </button>

              <button
                type="button"
                className="text-left border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-primary transition cursor-pointer bg-white dark:bg-gray-800"
                onClick={() => setMethod("sumsub")}
              >
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  Use Sumsub
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                  Continue with the existing Sumsub verification flow.
                </p>
              </button>
            </div>
          )}

          {method === "manual" && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <Input
                    ref={fullNameRef}
                    placeholder="Enter full name"
                    className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    value={manualForm.fullName}
                    onChange={(e) =>
                      handleManualChange("fullName", e.target.value)
                    }
                  />
                  {manualErrors.fullName && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      {manualErrors.fullName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Date of Birth
                  </label>
                  <Input
                    ref={dateOfBirthRef}
                    type="date"
                    className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    value={manualForm.dateOfBirth}
                    onChange={(e) =>
                      handleManualChange("dateOfBirth", e.target.value)
                    }
                  />
                  {manualErrors.dateOfBirth && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      {manualErrors.dateOfBirth}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Address
                  </label>
                  <Input
                    ref={addressRef}
                    placeholder="Enter address"
                    className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    value={manualForm.address}
                    onChange={(e) =>
                      handleManualChange("address", e.target.value)
                    }
                  />
                  {manualErrors.address && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      {manualErrors.address}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Country
                  </label>
                  <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        ref={countryTriggerRef}
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between dark:bg-gray-700 dark:text-white dark:border-gray-600",
                          !manualForm.countryCode && "text-muted-foreground",
                        )}
                      >
                        {manualForm.countryCode ? (
                          <span>
                            {
                              countryCodes.find((item) =>
                                selectedCountryIso
                                  ? item.iso === selectedCountryIso
                                  : item.code === manualForm.countryCode,
                              )?.name
                            }{" "}
                            {manualForm.countryCode}
                          </span>
                        ) : (
                          <span>Select country</span>
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0 dark:bg-gray-800 dark:border-gray-700">
                      <Command className="dark:bg-gray-800">
                        <CommandInput placeholder="Search country..." />
                        <CommandEmpty>No country found</CommandEmpty>
                        <CommandGroup className="max-h-[300px] overflow-auto">
                          {countryCodes.map(({ iso, name, code }) => (
                            <CommandItem
                              key={iso}
                              value={`${name.toLowerCase()} ${iso.toLowerCase()} ${code}`}
                              onSelect={() => {
                                setSelectedCountryIso(iso);
                                setManualForm((prev) => ({
                                  ...prev,
                                  country: name,
                                  countryCode: code,
                                }));
                                setManualErrors((prev) => ({
                                  ...prev,
                                  countryCode: "",
                                }));
                                setCountryOpen(false);
                              }}
                            >
                              <ReactCountryFlag
                                svg
                                countryCode={iso}
                                className="mr-2"
                              />
                              {name} ({code})
                              <Check
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  selectedCountryIso === iso &&
                                    manualForm.countryCode === code
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
                  {manualErrors.countryCode && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      {manualErrors.countryCode}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Document Type
                  </label>
                  <Select
                    value={manualForm.documentType}
                    onValueChange={(value) =>
                      handleManualChange(
                        "documentType",
                        value as ManualDocumentType,
                      )
                    }
                  >
                    <SelectTrigger className="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600">
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="national_id">National ID</SelectItem>
                      <SelectItem value="driving_license">
                        Driving License
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* {manualForm.documentType === "other" && (
                <Input
                  placeholder="Other document name"
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  value={manualForm.otherDocumentName}
                  onChange={(e) =>
                    handleManualChange("otherDocumentName", e.target.value)
                  }
                />
              )} */}

              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Upload KYC Document
                </label>
                <Input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={FILE_INPUT_ACCEPT}
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  onChange={handleManualFileChange}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Allowed: JPG, PNG, JPEG, WEBP, HEIC, PDF. Max size: 10MB each.
                  Maximum 3 files.
                </p>
                {manualErrors.files && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    {manualErrors.files}
                  </p>
                )}

                {manualFiles.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {manualFiles.map((file, index) => (
                      <div
                        key={`${file.name}-${file.lastModified}-${index}`}
                        className="rounded-md border border-gray-200 dark:border-gray-700 px-3 py-2"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm truncate pr-3">{file.name}</p>
                          <button
                            type="button"
                            onClick={() => removeManualFile(index)}
                            className="text-xs text-red-600 dark:text-red-400 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>

                        {file.type.startsWith("image/") &&
                          manualFilePreviews[index]?.previewUrl && (
                            <img
                              src={manualFilePreviews[index].previewUrl}
                              alt={file.name}
                              className="mt-2 h-24 w-24 rounded-md object-cover border border-gray-200 dark:border-gray-700"
                            />
                          )}

                        {file.type === "application/pdf" &&
                          manualFilePreviews[index]?.previewUrl && (
                            <a
                              href={manualFilePreviews[index].previewUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-2 inline-block text-sm text-primary underline"
                            >
                              Preview
                            </a>
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMethod(null)}
                  className="cursor-pointer dark:bg-gray-800 dark:text-white dark:border-gray-600"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  className="bg-primary text-white cursor-pointer"
                  onClick={handleManualSubmit}
                  disabled={manualSubmitting}
                >
                  {manualSubmitting ? "Submitting..." : "Submit Manual KYC"}
                </Button>
              </div>

              {profileLoading && (
                <p className="text-xs text-gray-500 dark:text-gray-300">
                  Loading profile for auto-fill...
                </p>
              )}
            </div>
          )}

          {method === "sumsub" && (
            <div className="mt-6">
              {!token && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/40 p-4">
                  <p className="text-sm text-amber-700 dark:text-amber-200">
                    {loadingToken
                      ? "Preparing Sumsub verification..."
                      : "Sumsub token not available yet. Please login again if needed to continue Sumsub KYC."}
                  </p>
                </div>
              )}

              <div id="sumsub-websdk-container"></div>

              <div className="flex gap-3 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMethod(null)}
                  className="cursor-pointer dark:bg-gray-800 dark:text-white dark:border-gray-600"
                >
                  Back
                </Button>
                {kycCompleted && (
                  <Button
                    type="button"
                    className="bg-primary text-white cursor-pointer"
                    onClick={() => router.push(ROUTES.LOGIN(locale))}
                  >
                    Continue to Login
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
