"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "./ui/Button";
import { CommonPhoneInput } from "./ui/CommonPhoneInput";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/Input";
import { LoadingButton } from "./ui/loading-button";

export type SocialSignupFormValues = {
  email: string;
  phone: string;
  name: string;
  countryCode: string;
  firebaseUserId: string;
};

type SocialSignupModalProps = {
  open: boolean;
  submitting: boolean;
  initialData: SocialSignupFormValues;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: SocialSignupFormValues) => Promise<void> | void;
};

export default function SocialSignupModal({
  open,
  submitting,
  initialData,
  onOpenChange,
  onSubmit,
}: SocialSignupModalProps) {
  const form = useForm<SocialSignupFormValues>({
    defaultValues: initialData,
  });

  useEffect(() => {
    if (open) form.reset(initialData);
  }, [open, initialData, form]);

  const countryCode = form.watch("countryCode");
  const localPhone = form.watch("phone");

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!submitting) onOpenChange(nextOpen);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Google Signup</DialogTitle>
          <DialogDescription>
            Confirm details and add your mobile number to continue.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(async (values) => onSubmit(values))}
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input value={form.watch("name")} disabled />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input type="email" value={form.watch("email")} disabled />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Mobile Number</label>
            <Controller
              name="phone"
              control={form.control}
              rules={{ required: "Mobile number is required" }}
              render={({ field }) => (
                <CommonPhoneInput
                  value={`${String(countryCode || "").replace("+", "")}${String(localPhone || "")}`}
                  onChange={(value, countryData) => {
                    const numericValue = String(value || "").replace(/\D/g, "");
                    const dialCode = String(countryData?.dialCode || "");
                    const nextLocal = dialCode
                      ? numericValue.replace(new RegExp(`^${dialCode}`), "")
                      : numericValue;

                    field.onChange(nextLocal);
                    if (dialCode) {
                      form.setValue("countryCode", `+${dialCode}`, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }
                  }}
                  disabled={submitting}
                  placeholder="Enter mobile number"
                  defaultCountry="us"
                />
              )}
            />
            {form.formState.errors.phone?.message ? (
              <p className="text-sm text-red-500">
                {form.formState.errors.phone.message}
              </p>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <LoadingButton
              type="submit"
              loading={submitting}
              disabled={submitting}
              label={submitting ? "Submitting..." : "Continue"}
              className="w-full sm:w-auto dark:text-white cursor-pointer"
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
