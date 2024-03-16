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
