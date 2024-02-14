import { create } from "zustand";

export enum Screens {
  OSC1 = "OSC 1",
  OSC2 = "OSC 2",
  LFO = "LFO",
  ENVELOPE = "ENV",
  FILTER = "FILTER",
}

type ScreenStore = {
  activeScreen: Screens;
  setActiveScreen: (screen: Screens) => void;
};

const useScreenStore = create<ScreenStore>((set) => ({
  activeScreen: Screens.OSC1,
  setActiveScreen: (screen: Screens) => set({ activeScreen: screen }),
}));

export function useScreen() {
  return useScreenStore((state) => state);
}