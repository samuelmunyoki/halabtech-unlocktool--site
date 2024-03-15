"use client";
import OdersComponent from "@/components/orders/OdersComponent";
import SalesComponent from "@/components/sales/SalesComponent";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GetOrders, useOrdersStore } from "@/store/OrderStore";
import { useUserStore } from "@/store/UserStore";

import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const logoutFn = useUserStore((state: any) => state.logout);
  const userData = useUserStore((state: any) => state.user);
  const ordersData = useOrdersStore((state: any) => state.orders);
  const addInitial = useOrdersStore((state: any) => state.addInitial);
  const clearorders = useOrdersStore((state: any) => state.clearorders);
  useEffect(() => {
    const checkUserDataAndRedirect = () => {
      if (userData != null) {
        setIsLoading(false);
        if (userData?.isadmin === true) {
          window.location.href = "/admin";
          return null;
          // Stop further execution of the component
        } else {
          if (window.location.pathname === "/login") {
            window.location.href = "/dashboard";
            return null;
          }
          // Stop further execution of the component
        }
      } else {
        setIsLoading(false);
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
          // Stop further execution of the component
          return null;
        }
      }
    };
    if (userData?.id === null) {
      console.log("userid", userData?.id);
      clearorders();
      GetOrders(userData?.id).then((res) => {
        addInitial(res);
        console.log("Orders Initial", ordersData);
        console.log("initial recieved", res);
      });
    }

    const timer = setTimeout(checkUserDataAndRedirect, 3000); // Check after 5 seconds

    return () => clearTimeout(timer); // Cleanup function to clear the timer
  }, [userData]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center text-blue-950 font-semibold text-lg w-screen h-screen">
        Loading Dashboard ...
      </div>
    );
  }

  return (
    <div className="min-w-screen flex flex-col items-center bg-gray-100">
      <div className=" bg-white shadow-sm h-14 w-[90vw] mx-8 my-2 border-gray-200 rounded-sm border flex flex-row items-center justify-between px-6">
        <p className="text-sm">
          Welcome,{" "}
          <span className="text-blue-700">
            {userData?.fullname.split(" ")[0]}
          </span>
        </p>
        <div className="flex flex-row text-sm w-fit space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <div className="relative">
                <div className="absolute top-0 right-0 bg-red-500 text-[9px] rounded-full flex justify-center items-center h-4 w-4 text-white">
                  1
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                  stroke="currentColor"
                  className="w-7 h-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                  />
                </svg>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="px-6">
              <DropdownMenuLabel className="text-blue-700">
                Notifications
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Order placed</DropdownMenuItem>
              <DropdownMenuItem>Billing was done. </DropdownMenuItem>
              <DropdownMenuItem>Processing your request.</DropdownMenuItem>
              <DropdownMenuItem>Subscription successfull.</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <div className="relative">
                <div className="absolute top-0 right-0 bg-red-500 text-[9px] rounded-full flex justify-center items-center h-4 w-4 text-white">
                  8
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                  stroke="currentColor"
                  className="w-7 h-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Order placed</DropdownMenuItem>
              <DropdownMenuItem>Billing ... </DropdownMenuItem>
              <DropdownMenuItem>Processing</DropdownMenuItem>
              <DropdownMenuItem>Subscription successfull.</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <OdersComponent />

          <svg
            fill="none"
            strokeWidth={1.2}
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="w-6 h-6 hover:text-blue-700 transition-colors cursor-pointer"
            onClick={() => {
              logoutFn(null);
              window.location.replace("/login");
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9"
            />
          </svg>
        </div>
      </div>

      <SalesComponent />
    </div>
  );
};

export default Dashboard;
