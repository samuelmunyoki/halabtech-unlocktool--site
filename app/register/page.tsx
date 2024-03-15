"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import RegistrationSchema from "@/schemas/RegistrationSchema";
import { useState } from "react";
import { ServerResponses } from "@/types/Responses";

export default function Login() {
  const form = useForm<z.infer<typeof RegistrationSchema>>({
    resolver: zodResolver(RegistrationSchema),
    defaultValues: {
      password: "",
      emailaddress: "",
      fullname: "",
      cpassword: "",
    },
  });
  const onSubmit: SubmitHandler<z.infer<typeof RegistrationSchema>> = async (
    formData
  ) => {
    setisSubmitted(true);
    try {
      const response = await axios.post("/api/user/register", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const data: ServerResponses = response.data;
        console.log(JSON.stringify(data));
        var resmsg = data.Message + "";

        toast(resmsg);

        setisSubmitted(false);
      } else {
        toast("Something went wrong. Try again later.");
        setisSubmitted(false);
      }
    } catch (error) {
      toast("Something went wrong. Try again later.");
      setisSubmitted(false);
    }
  };
  const [isSubmitted, setisSubmitted] = useState<boolean>(false);

  return (
    <main className="h-full w-full flex flex-col justify-center items-center m-auto overflow-hidden">
      <Toaster closeButton theme={"system"} position="top-right" />

      <Card className="w-[280px] h-fit md:w-[35vw]">
        <CardHeader className="text-blue-700 text-lg font-semibold text-center m-0 p-4">
          Create Account
        </CardHeader>
        <CardDescription className="text-sm text-center pb-2">
          <span className="flex text-center justify-center items-center mx-auto">
            Hi there, let's create an account.
            <span className="pl-2">
              <Image
                src="/svgs/waving.svg"
                width={20}
                height={20}
                aria-hidden
                alt="waving"
              />
            </span>
          </span>
        </CardDescription>
        <Separator className="mb-4" />
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              method="POST"
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emailaddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="email@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="*********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cpassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="*********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isSubmitted ? (
                <Button
                  disabled
                  className="w-full bg-blue-700 hover:bg-blue-900 transition-colors"
                  type="submit"
                >
                  Submitting . . .
                </Button>
              ) : (
                <Button
                  className="w-full bg-blue-700 hover:bg-blue-900 transition-colors"
                  type="submit"
                >
                  Submit
                </Button>
              )}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="text-sm text-center flex justify-center pb-01">
          <p>
            {" "}
            Already have an account?
            <span className="mx-1 text-blue-700">
              <Link href="/login">Login</Link>
            </span>
            <br></br>
            <span className="text-[12px] text-gray-300 pt-2">
              © 2024 - Halabtech
            </span>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
