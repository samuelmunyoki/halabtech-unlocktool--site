import { ServerResponses } from "@/types/Responses";
import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type OrderDetails = {
  Data?: any;
  Message?: string;
  Code: number;
};

export const useOrdersStore = create(
  persist(
    (set) => ({
      orders: [],
      clearorders: () => set({ orders: null }),
      add: (orderdata: any, state: any) =>
        set({ orders: state.orders.push(orderdata) }),
      addInitial: (orderdata: any) => set({ orders: orderdata }),
    }),
    {
      name: "orders-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export async function GetOrders(userid: string) {
  try {
    const response = await axios.post(
      "/api/order",
      { userid: userid },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      const data: ServerResponses = response.data;
      return data;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
}
