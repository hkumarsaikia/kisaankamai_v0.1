/**
 * @typedef {"owner"|"renter"} Workspace
 * @typedef {"owner"|"renter"|"both"} RolePreference
 */

function stripPhoneNumber(value) {
  if (!value) {
    return "";
  }

  return String(value).replace(/\D/g, "").slice(-10);
}

/**
 * @param {RolePreference | null | undefined} rolePreference
 * @returns {Workspace}
 */
export function normalizeFirebaseRolePreference(rolePreference) {
  return rolePreference === "owner" ? "owner" : "renter";
}

/**
 * @param {{
 *   decoded: { uid: string, name?: string | null, email?: string | null, phone_number?: string | null },
 *   userRecord?: { id: string, email: string, phone: string, passwordHash: string, roles: Array<Workspace>, createdAt: string, updatedAt: string } | null,
 *   profile?: {
 *     userId: string,
 *     fullName: string,
 *     village: string,
 *     address: string,
 *     pincode: string,
 *     fieldArea: number,
 *     rolePreference: RolePreference,
 *     email?: string,
 *     phone?: string,
 *   } | null,
 *   workspaceCookie?: string | null,
 * }} input
 */
export function buildLocalSessionFromFirebase(input) {
  const profile = input.profile ?? {
    userId: input.decoded.uid,
    fullName: input.decoded.name || "Kisan Kamai User",
    village: "",
    address: "",
    pincode: "",
    fieldArea: 0,
    rolePreference: "renter",
    email: input.userRecord?.email || input.decoded.email || undefined,
    phone: input.userRecord?.phone || stripPhoneNumber(input.decoded.phone_number) || undefined,
  };

  const workspace =
    input.workspaceCookie === "owner" || input.workspaceCookie === "renter"
      ? input.workspaceCookie
      : normalizeFirebaseRolePreference(profile.rolePreference);

  const phone =
    profile.phone ||
    input.userRecord?.phone ||
    stripPhoneNumber(input.decoded.phone_number) ||
    "";

  const email =
    profile.email ||
    input.userRecord?.email ||
    input.decoded.email ||
    `${input.decoded.uid}@kisankamai.local`;

  return {
    user: {
      id: input.decoded.uid,
      name: profile.fullName || input.decoded.name || "Kisan Kamai User",
      email,
      phone,
      roles: input.userRecord?.roles?.length ? input.userRecord.roles : ["owner", "renter"],
    },
    profile,
    activeWorkspace: workspace,
  };
}
