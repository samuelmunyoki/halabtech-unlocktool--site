import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package } from "@/types/Package";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useUserStore } from "@/store/UserStore";
import { Input } from "@/components/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import TransactionSchema from "@/schemas/Transaction";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ServerResponses } from "@/types/Responses";
import { GetOrders, useOrdersStore } from "@/store/OrderStore";
import { Toaster, toast } from "sonner";
interface Props {
  packageItem: Package;
}

export default function CardComponent({ packageItem }: Props) {
  const form = useForm<z.infer<typeof TransactionSchema>>({
    resolver: zodResolver(TransactionSchema),
    defaultValues: {
      email: "",
      address: "",
      txid: "",
    },
  });
  const onSubmit: SubmitHandler<z.infer<typeof TransactionSchema>> = async (
    formData
  ) => {
    const uid = userData?.id;
    if (uid == null) {
      toast("Kindly login or create an account!");
    } else {
      setisSubmitted(true);
      const mergedJSON = { ...formData, ...packageItem, userid: uid };
      setisSubmitted(true);
      try {
        const response = await axios.post("/api/order/place", mergedJSON, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          const data: ServerResponses = response.data;
          console.log(JSON.stringify(data));
          toast(data.Message + "Order Number:" + data?.Data.insertedId);
          if (data.Code === 2) {
            if (userData?.id != null) {
              console.log("userid", userData?.id);
              GetOrders(userData?.id).then((res) => {
                addInitial(res);
                console.log("initial recieved", res);
              });
            }
          }

          setisSubmitted(false);
        } else {
          console.log("Something went wrong. Try again later.");
          setisSubmitted(false);
        }
      } catch (error) {
        console.log(error);
        setisSubmitted(false);
      }

      setisSubmitted(false);
    }
  };
  const userData = useUserStore((state: any) => state.user);
  const [isSubmitted, setisSubmitted] = React.useState<boolean>(false);
  const [isOrderSuccess, setisOrderSuccess] = React.useState();
  const addInitial = useOrdersStore((state: any) => state.addInitial);
  const { Period, Price, Title, ImagePath } = packageItem;
  return (
    <Card className="w-[300px] h-fit mt-3 shadow-xl">
      <CardHeader>
        <CardTitle className="text-blue-700 text-center">{Title}</CardTitle>
        <Separator />
        <CardDescription className="text-center">Package</CardDescription>
      </CardHeader>
      <CardContent>
        <Toaster position="top-center" />
        <div className="grid w-full items-center justify-center gap-4">
          <Image src={ImagePath} alt="medal" width={120} height={120} />
          <div className="text-center">
            {Period} @ <span className="text-blue-700">{Price}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center items-center">
        <Dialog>
          <DialogTrigger className="bg-blue-700 w-full text-white h-10 rounded-md">
            Order
          </DialogTrigger>

          {userData?.id == null ? (
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-thin text-center text-blue-700">
                  User Identification.
                  <Separator className="mt-4" />
                </DialogTitle>
                <DialogDescription className="text-center mx-4">
                  Hey please login in before placing an order.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          ) : (
            <DialogContent className="flex flex-col justify-center items-center">
              <DialogHeader>
                <DialogTitle className="font-thin text-center">
                  Purchase of {Title} package.
                  <Separator className="mt-4" />
                </DialogTitle>
                <DialogDescription className="text-center mx-4">
                  Hey {userData?.fullname} you are purchasing {Title} valid for{" "}
                  {Period} @ <span className="text-blue-700">{Price}</span>
                </DialogDescription>
              </DialogHeader>

              <ol className="text-sm mx-2">
                <li className="mb-2 text-sm">
                  USDT TRC20 Purchase only supported at the moment. <br></br>
                  Kindly follow the steps:
                </li>
                <li className="mb-2">
                  1. Send {Price} to the address - (TRC20){" "}
                  <span className="text-blue-400">
                    {" "}
                    TPM6ec1A4pRZUNroa1st49a8eangcjJY4o
                  </span>
                </li>
                <li>2. Paste Transition ID and Your USDT addess below</li>
              </ol>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  method="POST"
                  className="space-y-8 w-full"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pack Email Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="subcription@mail.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="TJ3HfhsNNiAnK4WMsqToj7bnYw"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="txid"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transaction ID</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="TxID" {...field} />
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
                      Ordering . . .
                    </Button>
                  ) : (
                    <Button
                      className="w-full bg-blue-700 hover:bg-blue-900 transition-colors"
                      type="submit"
                    >
                      Order
                    </Button>
                  )}
                </form>
              </Form>
            </DialogContent>
          )}
        </Dialog>
      </CardFooter>
    </Card>
  );
}
