import { z } from "zod";

export const signUpSchema = z.object({
  username: z.string().min(2, "Full name must be atleast 2 characters"),
  fullName: z.string().min(2, "Full name must be atleast 2 characters"),
  password: z.string().min(6, "password must be atleast 6 characters"),
  email: z.string().email(),
});
