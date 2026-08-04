import z from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid Email"),
  password: z.string().min(8, "Password must be atleast 8 characters long"),
});

export type PostLogin = z.infer<typeof loginSchema>;

export interface UserInterface {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}
export interface PostLoginResponse {
  user: UserInterface;
}
