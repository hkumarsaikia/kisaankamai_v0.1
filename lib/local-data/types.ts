export type UserRole = "owner" | "renter";
export type RolePreference = UserRole | "both";

export interface UserRecord {
  id: string;
  email: string;
  phone: string;
  passwordHash: string;
  roles: UserRole[];
  fcmTokens?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProfileRecord {
  userId: string;
  fullName: string;
  village: string;
  address: string;
  pincode: string;
  fieldArea: number;
  rolePreference: RolePreference;
  email?: string;
  phone?: string;
}

export type ListingStatus = "active" | "paused";

export interface ListingRecord {
  id: string;
  ownerUserId: string;
  slug: string;
  name: string;
  category: string;
  categoryLabel: string;
  location: string;
  district: string;
  state: string;
  description: string;
  pricePerHour: number;
  unitLabel: string;
  rating: number;
  hp: string;
  distanceKm: number;
  ownerName: string;
  ownerLocation: string;
  ownerVerified: boolean;
  coverImage: string;
  galleryImages: string[];
  imagePaths: string[];
  tags: string[];
  workTypes: string[];
  operatorIncluded: boolean;
  availableFrom?: string;
  status: ListingStatus;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = "pending" | "upcoming" | "active" | "confirmed" | "completed" | "cancelled";

export interface BookingRecord {
  id: string;
  listingId: string;
  ownerUserId: string;
  renterUserId: string;
  status: BookingStatus;
  startDate: string;
  endDate: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SavedItemRecord {
  userId: string;
  listingId: string;
  createdAt: string;
}

export type PaymentStatus = "paid" | "processing" | "refunded";

export interface PaymentRecord {
  id: string;
  bookingId: string;
  ownerUserId: string;
  renterUserId: string;
  amount: number;
  status: PaymentStatus;
  method: string;
  createdAt: string;
}

export type SubmissionType =
  | "support-request"
  | "callback-request"
  | "feedback"
  | "owner-application"
  | "partner-inquiry"
  | "booking-request";

export interface FormSubmissionRecord {
  id: string;
  type: SubmissionType;
  userId?: string;
  listingId?: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface LocalSessionUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  roles: UserRole[];
}

export interface LocalSession {
  user: LocalSessionUser;
  profile: ProfileRecord;
  activeWorkspace: UserRole;
}

export interface LocalDataTables {
  "users.json": UserRecord[];
  "profiles.json": ProfileRecord[];
  "listings.json": ListingRecord[];
  "bookings.json": BookingRecord[];
  "saved-items.json": SavedItemRecord[];
  "payments.json": PaymentRecord[];
  "form-submissions.json": FormSubmissionRecord[];
}
