import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { GetOrders, OrderDetails, useOrdersStore } from "@/store/OrderStore";
import { Separator } from "../ui/separator";
import { useUserStore } from "@/store/UserStore";
import { Button } from "../ui/button";

const OdersComponent = () => {
  const [ordersData, setOrdersData] = useState<OrderDetails>();
  const userData = useUserStore((state: any) => state.user);
  const fetchData = async () => {
    if (userData?.id !== null) {
      var orders: any = await GetOrders(userData?.id);
      setOrdersData(orders);
    }
  };

  useEffect(() => {
    fetchData(); // Invoke the async function immediately
  }, [userData]);

  return (
    <>
      <Sheet>
        <SheetTrigger className="text-sm hover:text-blue-700">
          Orders
        </SheetTrigger>

        <SheetContent className="overflow-scroll flex flex-col items-center">
          <SheetHeader>
            <SheetTitle className="text-blue-700  text-center">
              Your orders
            </SheetTitle>
            <Separator />
          </SheetHeader>
          <SheetDescription className="text-sm">
            Summary of your orders and status.
          </SheetDescription>
          {ordersData?.Code === 3 ? (
            <>
              <Image src="/award.png" alt="medal" width={120} height={120} />
              <p className="text-sm text-center">
                You have no orders.<br></br>
                <br></br>
                <span className="text-blue-700">Place an order.</span>
              </p>
            </>
          ) : (
            ordersData?.Data?.map((order: any, index: any) => (
              <div
                key={index}
                className="w-full mt-4 flex flex-col bg-white shadow-md rounded-lg mb-2 justify-evenly p-4"
              >
                <div className="flex flex-row justify-between w-full ">
                  <p className="text-sm">{order.packtitle} Package</p>
                  <p
                    className={`text-[12px] text-center px-2 rounded-md text-white ${
                      order.packstatus === 0
                        ? "bg-orange-300"
                        : order.packstatus === 1
                        ? "bg-yellow-400"
                        : order.packstatus === 2
                        ? "bg-red-500"
                        : order.packstatus === 3
                        ? "bg-green-400"
                        : ""
                    }`}
                  >
                    {order.packstatus === 0
                      ? "Queued"
                      : order.packstatus === 1
                      ? "Processing"
                      : order.packstatus === 2
                      ? "Declined"
                      : order.packstatus === 3
                      ? "Delivered"
                      : ""}
                  </p>
                </div>

                <p className="text-[12px] pt-2">#Order: {order._id}</p>
                <p className="text-[12px] pt-2 text-gray-500">
                  Pack Email: {order.packemail}
                </p>
              </div>
            ))
          )}
          <SheetFooter className="w-full">
            <Button
              onClick={fetchData}
              className=" min-w-full bg-blue-700 hover:bg-blue-500 transition-colors"
            >
              Refresh Orders
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default OdersComponent;
