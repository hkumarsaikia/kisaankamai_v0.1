export type Locale = "en" | "mr";
export type Workspace = "owner" | "renter";

export interface UserProfile {
  uid: string;
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  village: string;
  pincode: string;
  fieldArea: number;
  workspacePreference: Workspace;
  createdAt: string;
  updatedAt: string;
}

export interface SessionUser {
  uid: string;
  fullName: string;
  phone?: string;
  email?: string;
  workspacePreference: Workspace;
}

export interface SessionRecord {
  user: SessionUser;
  profile: UserProfile | null;
}

export interface UserRecord {
  uid: string;
  email?: string;
  phone?: string;
  fullName?: string;
  workspacePreference: Workspace;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface ListingRecord {
  id: string;
  ownerUid: string;
  name: string;
  category: string;
  description: string;
  district: string;
  location: string;
  pricePerHour: number;
  operatorIncluded: boolean;
  status: "active" | "paused";
  coverImage?: string;
  imagePaths: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BookingRecord {
  id: string;
  listingId: string;
  listingName: string;
  ownerUid: string;
  renterUid: string;
  renterName: string;
  fieldLocation: string;
  workType: string;
  approxHours?: number;
  startDate?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  id: string;
  bookingId: string;
  ownerUid: string;
  renterUid: string;
  amount: number;
  status: "pending" | "paid" | "refunded";
  method: string;
  createdAt: string;
}

export interface SubmissionRecord {
  id: string;
  type: "support" | "feedback";
  userUid?: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface SavedItemRecord {
  id: string;
  userUid: string;
  listingId: string;
  createdAt: string;
}

export interface ListingFormInput {
  name: string;
  category: string;
  description: string;
  district: string;
  location: string;
  pricePerHour: number;
  operatorIncluded: boolean;
}

export interface BookingInput {
  listingId: string;
  listingName: string;
  ownerUid: string;
  fieldLocation: string;
  workType: string;
  approxHours?: number;
  startDate?: string;
}
