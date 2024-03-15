import { z } from "zod";

const LoginSchema = z.object({
  password: z.string().min(1, {
    message: "Enter a password.",
  }),
  emailaddress: z.string().email({
    message: "Password cannot be empty.",
  }),
});
export default LoginSchema;
