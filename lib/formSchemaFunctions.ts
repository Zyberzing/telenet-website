import { z } from "zod";

export const commonFieldSchema = () =>
  z
    .string({ message: "This field is required" })
    .trim()
    .min(1, { message: "This field is required" });

// export const phoneValidationSchema = z
//   .string()
//   .trim()
//   .min(1, { message: "Phone number is required" })
//   .refine(
//     (value) => {
//       try {
//         const phoneWithPlus = value.startsWith("+") ? value : `+${value}`;
//         return isValidPhoneNumber(phoneWithPlus);
//       } catch {
//         return false;
//       }
//     },
//     {
//       message: "Please enter a valid phone number",
//     },
//   );

// export const phoneNumberSchema = () => phoneValidationSchema;

export const phoneNumberSchema = () =>
  z
    .string()
    .trim()
    .min(1, { message: "This field is required" })
    .regex(/^\+?[1-9]\d{7,14}$/, { message: "Invalid phone number" });

export const emailSchema = () =>
  z
    .string()
    .trim()
    .min(1, { message: "This field is required" })
    .email({ message: "Invalid email" });

export const passwordSchema = () =>
  z
    .string()
    .min(1, { message: "This field is required" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/, {
      message:
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
    });

export const countryCodeSchema = (message?: string) =>
  z.string().min(1, { message: message || "Country code is required" });
