import { create } from "zustand";
import _default from "../themes/default.json";

export type Theme = typeof _default;
export type ThemeTypes = keyof typeof themes;

type ThemeStore = {
    theme: Theme;
    setTheme: (theme: ThemeTypes) => void;
};

type CreateStylesArugmentFn = (theme: Theme) => {
    [key: string]: React.CSSProperties;
};

export const themes = {
    default: _default,
};

export const useThemeStore = create<ThemeStore>((set) => ({
    theme: themes.default,
    setTheme: (theme: ThemeTypes) => set({ theme: themes[theme] }),
}));

export function useTheme() {
    return useThemeStore((state) => state.theme);
}

export const createStyles =
    <T extends CreateStylesArugmentFn>(fn: T) =>
    (): ReturnType<T> => {
        const theme = useTheme();
        return fn(theme) as ReturnType<T>;
    };
