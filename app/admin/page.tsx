"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useUserStore } from "@/store/UserStore";
import React, { useEffect, useState } from "react";

const Admin = () => {
  enum Status {
    Queued = "Queued",
    Processing = "Processing",
    Declined = "Declined",
    Delivered = "Delivered",
  }

  interface Order {
    _id: string;
    packemail: string;
    packstatus: number;
    packtitle: string;
    packprice: string;
    packtxid: string;
    packaddr: string;
    createdAt: string;
  }
  const getStatusLabel = (status: number) => {
    switch (status) {
      case 0:
        return "Queued";
      case 1:
        return "Processing";
      case 2:
        return "Declined";
      case 3:
        return "Delivered";
      default:
        return "";
    }
  };
  const [isLoading, setIsLoading] = useState(true);

  const logoutFn = useUserStore((state: any) => state.logout);
  const userData = useUserStore((state: any) => state.user);
  const [orders, setOrders] = useState<Order[]>();
  const handleActionChange = async (orderId: string, action: Status) => {
    console.log("co");
    try {
      const response = await fetch("/api/order/action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ txid: orderId, action: action }),
      });
      if (!response.ok) {
        throw new Error("Failed to update order status");
      }
      // Refresh orders after successful update
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  useEffect(() => {
  const checkUserDataAndRedirect = () => {
     if (!userData || !userData.isadmin) {
    // Redirect logic here (e.g., using react-router-dom)
    // Replace '/login' with the actual path of your login page
    	window.location.href = '/login';
	  } else {
	      setIsLoading(false);
	      fetchOrders();
	   }
    }
    const timer = setTimeout(checkUserDataAndRedirect, 3000); // Check after 5 seconds

    return () => clearTimeout(timer); // Cleanup function to clear the timer
  }, [userData]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/order");
      const data = await response.json();
      console.log(data.Data);
      setOrders(data.Data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="flex flex-col justify-center items-center text-blue-950 font-semibold text-lg w-screen h-screen">
          Checking Admin ...
        </div>
      ) : (
        <div className="min-w-screen flex flex-col items-center ">
          <div className=" bg-white shadow-sm h-14 w-[90vw] mx-8 my-2 border-gray-200 rounded-sm border flex flex-row items-center justify-between px-6">
            <p className="text-sm">
              Welcome Admin,{" "}
              <span className="text-blue-700">
                {userData?.fullname.split(" ")[0]}
              </span>
            </p>
            <div className="flex flex-row text-sm w-fit space-x-4">
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
          <div className="w-[90vw] bg-white shadow-md rounded-md h-fit">
            <Table>
              <TableCaption className="p-4">
                A list of your recent orders.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Email</TableHead>
                  <TableHead>TxID</TableHead>
                  <TableHead>Pack Status</TableHead>
                  <TableHead>Pack Title</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Actions</TableHead>
                  <TableHead>Created at</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders == undefined ? (
                  <></>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.packemail}>
                      <TableCell className="font-medium">
                        {order.packemail}
                      </TableCell>
                      <TableCell>{order.packtxid}</TableCell>

                      <TableCell>{getStatusLabel(order.packstatus)}</TableCell>
                      <TableCell>{order.packtitle}</TableCell>
                      <TableCell className="text-right">
                        {order.packprice}
                      </TableCell>
                      <TableCell>
                        <select
                          onChange={(e) =>
                            handleActionChange(
                              order.packtxid,
                              e.target.value as Status
                            )
                          }
                        >
                          <option value="">Select Action</option>
                          {Object.values(Status).map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </>
  );
};

export default Admin;
