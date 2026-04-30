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
