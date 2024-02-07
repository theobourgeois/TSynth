import { create } from "zustand";
import { ThemeTypes, themes } from "./utils/theme-utils";

export const useStore = create((set) => ({
    theme: themes.default,
    setTheme: (theme: ThemeTypes) => set({ theme: themes[theme] }),
}));
