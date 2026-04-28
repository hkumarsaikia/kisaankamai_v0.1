import { z } from "zod";

const tenDigitPhone = z
  .string()
  .trim()
  .transform((value) => value.replace(/\D/g, "").slice(-10))
  .refine((value) => /^\d{10}$/.test(value), "Enter a valid 10-digit mobile number.");

const sixDigitPincode = z
  .string()
  .trim()
  .regex(/^\d{6}$/, "Enter a valid 6-digit pincode.");

const optionalEmail = z
  .union([z.literal(""), z.string().trim().email("Enter a valid email address.")])
  .transform((value) => value || undefined);

const positiveNumberString = z
  .union([z.string(), z.number()])
  .transform((value) => Number(value))
  .refine((value) => Number.isFinite(value) && value > 0, "Enter a valid positive number.");

export const loginInputSchema = z
  .object({
    phone: tenDigitPhone,
    password: z.string().min(1, "Enter your password."),
  })
  .strict();

export const registerInputSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name.").max(120),
    email: optionalEmail,
    address: z.string().trim().min(3, "Enter your address.").max(200),
    village: z.string().trim().min(2, "Enter your city or village.").max(120),
    pincode: sixDigitPincode,
    phone: tenDigitPhone,
    fieldArea: z.union([positiveNumberString, z.string()]).optional(),
    password: z.string().min(6, "Password must be at least 6 characters.").max(128),
    role: z.enum(["renter", "owner", "both"]).default("renter"),
    otpVerified: z.boolean().optional().default(false),
    district: z.string().optional(),
    language: z.enum(["en", "mr"]).optional(),
    idType: z.string().optional(),
    idNumber: z.string().optional(),
  })
  .strict();

export const completeProfileSchema = z
  .object({
    phone: tenDigitPhone,
    pincode: sixDigitPincode,
    village: z.string().trim().max(120).optional().or(z.literal("")),
    address: z.string().trim().max(200).optional().or(z.literal("")),
    role: z.enum(["renter", "owner", "both"]).default("renter"),
  })
  .strict();

export const forgotPasswordContactSchema = z
  .object({
    contact: z.string().trim().min(1, "Enter your registered mobile number."),
  })
  .strict();

export const verifyContactInputSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your full name."),
    phone: tenDigitPhone,
    pincode: sixDigitPincode,
    village: z.string().trim().min(2, "Select your location."),
  })
  .strict();

export const partnerInquirySchema = z
  .object({
    organizationName: z.string().trim().min(2, "Enter the organization name.").max(160),
    partnerType: z.string().trim().min(2, "Select the partner type.").max(80),
    contactPerson: z.string().trim().min(2, "Enter the contact person.").max(120),
    phone: tenDigitPhone,
    businessLocation: z.string().trim().min(2, "Enter the business location.").max(160),
    message: z.string().trim().min(10, "Describe the partnership goals.").max(2000),
  })
  .strict();

export const callbackRequestSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name.").max(120),
    phone: tenDigitPhone,
    equipmentNeeded: z.string().trim().min(2, "Describe the equipment needed.").max(160),
    location: z.string().trim().max(160).optional().or(z.literal("")),
  })
  .strict();

export const feedbackSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name.").max(120),
    mobileNumber: tenDigitPhone,
    email: optionalEmail,
    role: z.enum(["farmer", "owner", "partner", "visitor"]),
    category: z.string().trim().min(2, "Select a feedback category.").max(80),
    subject: z.string().trim().min(4, "Enter a subject.").max(160),
    message: z.string().trim().min(10, "Enter your feedback.").max(2500),
    rating: z.number().int().min(1).max(5).optional(),
    contactMe: z.boolean().optional().default(false),
  })
  .strict();

export const ownerApplicationSchema = z
  .object({
    equipmentType: z.string().trim().min(2, "Select the equipment type.").max(120),
    brand: z.string().trim().min(2, "Enter the equipment brand.").max(120),
    modelYear: z.string().trim().min(2, "Enter the model and year.").max(120),
    horsepower: z.string().trim().min(1, "Enter the horsepower.").max(40),
    ratePerHour: positiveNumberString,
    ratePerAcre: z
      .union([z.literal(""), z.string(), z.number()])
      .optional()
      .transform((value) => {
        if (value === "" || value === undefined) return undefined;
        return Number(value);
      })
      .refine((value) => value === undefined || (Number.isFinite(value) && value > 0), "Enter a valid per-acre rate."),
    district: z.string().trim().min(2, "Select the district.").max(120),
    taluka: z.string().trim().min(2, "Enter the taluka.").max(120),
    radius: positiveNumberString,
  })
  .strict();

export const supportRequestSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name.").max(120),
    phone: tenDigitPhone,
    email: optionalEmail,
    category: z.string().trim().min(2, "Select a category.").max(120),
    message: z.string().trim().min(10, "Describe how we can help.").max(2500),
    sourcePath: z.string().trim().min(1).max(120),
  })
  .strict();

export const bookingRequestSchema = z
  .object({
    sourcePath: z.string().trim().min(1).max(120),
    equipmentId: z.string().trim().optional().or(z.literal("")),
    equipmentName: z.string().trim().optional().or(z.literal("")),
    fieldLocation: z.string().trim().min(2, "Enter the field location.").max(160),
    workType: z.string().trim().min(2, "Select the work type.").max(120),
    approxHours: z
      .union([z.literal(""), z.string(), z.number()])
      .optional()
      .transform((value) => {
        if (value === "" || value === undefined) return undefined;
        return Number(value);
      })
      .refine((value) => value === undefined || (Number.isFinite(value) && value > 0), "Enter valid hours."),
    phone: tenDigitPhone,
    startDate: z.string().trim().optional().or(z.literal("")),
    duration: z.string().trim().optional().or(z.literal("")),
    task: z.string().trim().optional().or(z.literal("")),
    fieldSize: z
      .union([z.literal(""), z.string(), z.number()])
      .optional()
      .transform((value) => {
        if (value === "" || value === undefined) return undefined;
        return Number(value);
      })
      .refine((value) => value === undefined || (Number.isFinite(value) && value > 0), "Enter valid field size."),
  })
  .strict();

export type RegisterInput = z.infer<typeof registerInputSchema>;
export type RegisterInputPayload = z.input<typeof registerInputSchema>;
