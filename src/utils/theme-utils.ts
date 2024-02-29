import { create } from "zustand";
import _default from "../themes/default.json";
import _blue from "../themes/blue.json";
import _pink from "../themes/pink.json";

export type Theme = typeof _default;
export type ThemeTypes = keyof typeof themes;

type ThemeStore = {
    themeName: ThemeTypes;
    theme: Theme;
    setTheme: (theme: ThemeTypes) => void;
};

type CreateStylesArugmentFn = (theme: Theme, ...args: unknown[]) => {
    [key: string]: React.CSSProperties;
};

export const themes = {
    default: _default,
    blue: _blue,
    pink: _pink
};

export const useThemeStore = create<ThemeStore>((set) => ({
    themeName: "default",
    theme: themes.default,
    setTheme: (themeName: ThemeTypes) => set({ theme: themes[themeName], themeName }),
}));

export function useTheme() {
    return useThemeStore((state) => state.theme);
}

export const createStyles =
    <T extends CreateStylesArugmentFn>(fn: T) =>
        (...args: unknown[]): ReturnType<T> => {
            const theme = useTheme();
            return fn(theme, ...args) as ReturnType<T>;
        };
