import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserState = {
  name: string;
  progress: number;
  lessons: string[];
  setUser: (data: Partial<UserState>) => void;
};

export const useUserStore = create(
  persist<UserState>(
    (set) => ({
      name: "",
      progress: 0,
      lessons: [],
      setUser: (data) => set((state) => ({ ...state, ...data })),
    }),
    { name: "user-storage" }
  )
);
