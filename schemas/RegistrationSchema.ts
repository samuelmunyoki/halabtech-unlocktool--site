import { z } from "zod";

const RegistrationSchema = z
  .object({
    password: z.string().min(8, {
      message: "Password must be atleast 8 characters.",
    }),
    cpassword: z.string().min(1, {
      message: "Enter a confirm password.",
    }),
    fullname: z.string().min(3, {
      message: "Name should have atleast 3 letters",
    }),
    emailaddress: z.string().email({
      message: "Password cannot be empty.",
    }),
  })
  .refine((data) => data.password === data.cpassword, {
    message: "Passwords don't match",
    path: ["cpassword"],
  });
export default RegistrationSchema;
