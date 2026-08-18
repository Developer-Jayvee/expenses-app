import z from "zod";

export const registerSchema = z
  .object({
    first_name: z
      .string()
      .trim()
      .min(1, "First name is required")
      .max(255, "First name must be at most 255 characters"),
    last_name: z
      .string()
      .trim()
      .min(1, "Last name is required")
      .max(255, "Last name must be at most 255 characters"),
    email: z.email("Invalid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(18, "Maximum password allowed is 18")
      .regex(/^[A-Za-z0-9]+$/, "Numeric and Letters are allowed."),
    password_confirmation: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export type PostRegister = z.infer<typeof registerSchema>;

export interface RegisteredUserInterface {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}
export interface PostRegisterResponse {
  user: RegisteredUserInterface;
}
