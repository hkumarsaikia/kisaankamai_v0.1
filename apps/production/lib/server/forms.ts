import { z } from "zod";

export const profileSchema = z.object({
  fullName: z.string().trim().min(2),
  phone: z.string().trim().regex(/^\+?\d{10,15}$/),
  email: z.string().trim().email().optional().or(z.literal("")),
  address: z.string().trim().min(3),
  village: z.string().trim().min(2),
  pincode: z.string().trim().regex(/^\d{6}$/),
  fieldArea: z.coerce.number().positive(),
  workspacePreference: z.enum(["owner", "renter"]),
});

export const listingSchema = z.object({
  name: z.string().trim().min(2),
  category: z.string().trim().min(2),
  description: z.string().trim().min(10),
  district: z.string().trim().min(2),
  location: z.string().trim().min(2),
  pricePerHour: z.coerce.number().positive(),
  operatorIncluded: z.boolean(),
});

export const bookingSchema = z.object({
  listingId: z.string().trim().min(1),
  listingName: z.string().trim().min(1),
  ownerUid: z.string().trim().min(1),
  fieldLocation: z.string().trim().min(2),
  workType: z.string().trim().min(2),
  approxHours: z.coerce.number().positive().optional(),
  startDate: z.string().trim().optional().or(z.literal("")),
});

export const supportSchema = z.object({
  fullName: z.string().trim().min(2),
  phone: z.string().trim().regex(/^\+?\d{10,15}$/),
  category: z.string().trim().min(2),
  message: z.string().trim().min(10),
});
