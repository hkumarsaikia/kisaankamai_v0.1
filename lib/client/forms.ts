"use client";

export class SubmissionError extends Error {
  fieldErrors?: Record<string, string[]>;
  status: number;

  constructor(message: string, status = 500, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.name = "SubmissionError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export function firstSubmissionFieldError(error: unknown) {
  if (!(error instanceof SubmissionError) || !error.fieldErrors) {
    return "";
  }

  return Object.values(error.fieldErrors).find((messages) => messages?.[0])?.[0] || "";
}

export function formatSubmissionError(error: unknown, fallback = "Submission failed.") {
  if (error instanceof SubmissionError) {
    return firstSubmissionFieldError(error) || error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
}

export async function postJson<T>(url: string, payload: unknown) {
  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new SubmissionError(
      data.error || "Submission failed.",
      response.status,
      data.fieldErrors
    );
  }

  return data as T;
}
