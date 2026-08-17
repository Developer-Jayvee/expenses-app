import type { ErrorResponseI } from "@c/types/globalTypes";
import axios from "axios";

export function extractValidationErrors(
  error: unknown,
): Record<string, string> {
  if (!axios.isAxiosError<ErrorResponseI>(error)) {
    return {};
  }

  const errors = error.response?.data?.data;

  if (!errors) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(errors)
      .filter(([, messages]) => messages.length > 0)
      .map(([field, messages]) => {
        return [field, typeof messages === "object" ? messages?.[0] : ""];
      }),
  );
}

export function extractRawHttpError(error: unknown): ErrorResponseI | null {
  if (!axios.isAxiosError<ErrorResponseI>(error)) {
    return null;
  }

  return error.response?.data ?? null;
}
