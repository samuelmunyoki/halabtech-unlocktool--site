"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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
import LoginSchema from "@/schemas/LoginSchema";
import axios from "axios";
import { ServerResponses } from "@/types/Responses";
import { Toaster, toast } from "sonner";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/UserStore";
import { useRouter } from "next/router";

export default function Login() {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      password: "",
      emailaddress: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof LoginSchema>> = async (
    formData
  ) => {
    setisSubmitted(true);
    try {
      const response = await axios.post("/api/user/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const data: ServerResponses = response.data;
        console.log(JSON.stringify(data));
        var resmsg = data.Message + "";
        console.log("Code: ", data.Code);

        toast(resmsg);

        if (data.Code === 2) {
          addLoginData(data.Data);
        }
        setisSubmitted(false);
      } else {
        toast("Something went wrong. Try again later.");
        setisSubmitted(false);
      }
    } catch (error) {
      console.log(error);
      toast("Something went wrong. Try again later.");
      setisSubmitted(false);
    }
  };
  const [isSubmitted, setisSubmitted] = useState<boolean>(false);
  const addLoginData = useUserStore((state: any) => state.login);
  const storeData = useUserStore((state: any) => state.user);

  useEffect(() => {
    console.log(typeof storeData);
    if (storeData !== null) {
      window.location.replace("/dashboard");
    }
  }, [storeData]);

  return (
    <main className="h-full w-full flex flex-col justify-center items-center m-auto overflow-hidden">
      <Toaster closeButton theme={"system"} position="top-right" />
      <Card className="w-[300px] h-fit md:w-[30vw]">
        <CardHeader className="text-blue-700 text-lg font-semibold text-center m-0 p-4">
          Login
        </CardHeader>
        <CardDescription className="text-sm text-center pb-2 ">
          <span className="flex text-center justify-center items-center mx-auto">
            Hi there, welcome back.
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
        <CardFooter className="text-sm text-center flex justify-center">
          <p>
            Creat an account ?{" "}
            <span className="mx-1 text-blue-700">
              <Link href="register">Register</Link>
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
