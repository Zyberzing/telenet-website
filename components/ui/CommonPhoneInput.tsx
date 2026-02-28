"use client";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface CommonPhoneInputProps {
  value: string;
  onChange: (
    value: string,
    countryData?: { dialCode?: string; countryCode?: string },
  ) => void;
  disabled?: boolean;
  placeholder?: string;
  defaultCountry?: string;
}

export function CommonPhoneInput({
  value,
  onChange,
  disabled = false,
  placeholder = "Enter phone number",
  defaultCountry = "us",
}: CommonPhoneInputProps) {
  return (
    <PhoneInput
      country={defaultCountry}
      value={value}
      onChange={(nextValue, countryData) =>
        onChange(nextValue, countryData as { dialCode?: string; countryCode?: string })
      }
      disabled={disabled}
      placeholder={placeholder}
      disableSearchIcon
      countryCodeEditable={false}
      inputClass="!w-full !h-10 !rounded-md !border !border-input !bg-background !text-foreground !text-sm hover:!bg-accent/20 hover:!border-accent focus:!bg-background focus:!border-accent focus:!outline-none disabled:!cursor-not-allowed disabled:!opacity-50"
      containerClass="!w-full"
      buttonClass="!border !border-input !bg-background !text-foreground !rounded-l-md !transition-colors hover:!bg-accent/20 hover:!border-accent hover:!text-foreground focus:!outline-none disabled:!cursor-not-allowed disabled:!opacity-50"
      dropdownClass="!max-h-[300px] !overflow-y-auto !bg-background !text-foreground !border !border-input [&_li:hover]:!bg-accent [&_li:hover]:!text-accent-foreground [&_li.highlight]:!bg-accent [&_li.highlight]:!text-accent-foreground"
    />
  );
}
