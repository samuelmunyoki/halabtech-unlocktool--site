import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
export type UserLoginDetails = {
  id: string;
  fullname: string;
  emailaddress: string;
  isadmin: boolean;
};
export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      logout: (userdata: any) => set({ user: userdata }),
      login: (userdata: any) => set({ user: userdata }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
