const getEnvValue = (value: string | undefined, fallback: string) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
};

export const TEAM_REVIEW_CONFIG = {
  enabled: process.env.NEXT_PUBLIC_TEAM_REVIEW_MODE === "true",
  phone: getEnvValue(process.env.NEXT_PUBLIC_TEAM_TEST_PHONE, "8761085453"),
  email: getEnvValue(process.env.NEXT_PUBLIC_TEAM_TEST_EMAIL, "test@example.com").toLowerCase(),
  password: getEnvValue(process.env.NEXT_PUBLIC_TEAM_TEST_PASSWORD, "Test@12345")
};

export const normalizeTeamReviewEmail = (email: string) => email.trim().toLowerCase();

export const isTeamReviewLoginPhone = (identifier: string) =>
  TEAM_REVIEW_CONFIG.enabled && identifier.trim() === TEAM_REVIEW_CONFIG.phone;

export const resolveLoginEmail = (identifier: string) => {
  const normalizedIdentifier = identifier.trim();

  if (isTeamReviewLoginPhone(normalizedIdentifier)) {
    return TEAM_REVIEW_CONFIG.email;
  }

  return normalizedIdentifier.includes("@")
    ? normalizedIdentifier
    : `${normalizedIdentifier}@kisankamai.com`;
};

export const isTeamReviewRegistration = ({
  phone,
  email,
  password
}: {
  phone: string;
  email: string;
  password: string;
}) =>
  TEAM_REVIEW_CONFIG.enabled &&
  phone === TEAM_REVIEW_CONFIG.phone &&
  normalizeTeamReviewEmail(email) === TEAM_REVIEW_CONFIG.email &&
  password === TEAM_REVIEW_CONFIG.password;
