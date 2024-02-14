import { create } from "zustand";

export enum SampleType {
  Sine = "sine",
  Square = "square",
  Sawtooth = "sawtooth",
  Triangle = "triangle",
}

export type Sample = {
  type: SampleType;
  period: number; // in samples
  amplitude: number; // -1 to 1
  offset: number; // -1 to 1
  noise: number; // 0 to 1
}

export type WaveData = number[]

export type Wave = {
  data: WaveData;
  octave: number;
  semitone: number;
  fine: number;
}

export type Oscillator = {
  wave: Wave;
  unison: number;
  detune: number;
  pan: number;
  level: number;
  octave: number;
  semitone: number;
  fine: number;
  enabled: boolean;
}

export type FilterPreset = TODO;

export type Filter = {
  preset: FilterPreset;
  cutoff: number;
  resonance: number;
  pan: number;
  drive: number;
  mix: number;
  enabled: boolean;
  osc1Enabled: boolean;
  osc2Enabled: boolean;
}

export type LFOData = TODO;
export type LFOAttachement = TODO;

export type LFO = {
  LFOData: LFOData;
  rate: number;
  attachements: LFOAttachement[]
}

export type Envelope = {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
};

const initialOsillator1: Oscillator = {
  enabled: true,
  wave: {
    data: Array.from({ length: 512 }, (_, i) => Math.sin(i / 30)),
    octave: 0,
    semitone: 0,
    fine: 0,
  },
  semitone: 0,
  octave: 0,
  fine: 0,
  unison: 0,
  detune: 0,
  pan: 0,
  level: 0,
}

const initialOsillator2: Oscillator = {
  enabled: false,
  wave: {
    data: Array.from({ length: 512 }, (_, i) => Math.sin(i / 30)),
    octave: 0,
    semitone: 0,
    fine: 0,
  },
  semitone: 0,
  octave: 0,
  fine: 0,
  unison: 0,
  detune: 0,
  pan: 0,
  level: 0,
}

const initialFilter: Filter = {
  enabled: false,
  preset: {},
  cutoff: 0,
  resonance: 0,
  pan: 0,
  drive: 0,
  mix: 0,
  osc1Enabled: false,
  osc2Enabled: false,
}

const initialLFO: LFO = {
  LFOData: {},
  rate: 0,
  attachements: []
}

const initialEnvelope: Envelope = {
  attack: 0,
  decay: 0,
  sustain: 0,
  release: 0,
}

export interface SynthState {
  oscillator1: Oscillator;
  oscillator2: Oscillator;
  filter: Filter;
  LFO: LFO;
  envelope: Envelope;
}

export interface SynthStore extends SynthState {
  setOscillator1: (oscillator: Oscillator) => void;
  setOscillator2: (oscillator: Oscillator) => void;
  setFilter: (filter: Filter) => void;
  setLFO: (LFO: LFO) => void;
  setEnvelope: (envelope: Envelope) => void;
}

const useSynthStore = create<SynthStore>((set) => ({
  oscillator1: initialOsillator1,
  oscillator2: initialOsillator2,
  filter: initialFilter,
  LFO: initialLFO,
  envelope: initialEnvelope,
  setOscillator1: (oscillator: Oscillator) => set({ oscillator1: oscillator }),
  setOscillator2: (oscillator: Oscillator) => set({ oscillator2: oscillator }),
  setFilter: (filter: Filter) => set({ filter: filter }),
  setLFO: (LFO: LFO) => set({ LFO: LFO }),
  setEnvelope: (envelope: Envelope) => set({ envelope: envelope }),
}));

export function useSynth() {
  return useSynthStore((state) => state);
}

// f prefix means flipped
export enum WaveEditorWaveType {
  Sine = "sine",
  FSine = "usine",
  Square = "square",
  Triangle = "triangle",
  FTriangle = "ftriangle",
  Sawtooth = "sawtooth",
  FSawtooth = "fsawtooth",
  Noise = "noise",
  Line = "line",
}

export function getSampleDataFromType(
  type: WaveEditorWaveType,
  gridSizeY: number,
  snapY: number,
) {
  const amplitude = snapY === -1 ? 0 : (1 / gridSizeY) * 2
  switch (type) {
    case WaveEditorWaveType.Sine:
      return {
        type: SampleType.Sine,
        amplitude: -amplitude,
        noise: 0,
        offset: snapY - (1 / gridSizeY) * 2,
        period: 1,
      };
    case WaveEditorWaveType.FSine:
      return {
        type: SampleType.Sine,
        amplitude: amplitude,
        noise: 0,
        offset: snapY,
        period: 1,
      };
    case WaveEditorWaveType.Square:
      return {
        type: SampleType.Square,
        amplitude: Math.sign(snapY) * amplitude,
        noise: 0,
        offset: snapY,
        period: 1,
      };
    case WaveEditorWaveType.Triangle:
      return {
        type: SampleType.Triangle,
        amplitude: -amplitude,
        noise: 0,
        offset: snapY - (1 / gridSizeY) * 2,
        period: 1,
      };
    case WaveEditorWaveType.FTriangle:
      return {
        type: SampleType.Triangle,
        amplitude: amplitude,
        noise: 0,
        offset: snapY,
        period: 1,
      };
    case WaveEditorWaveType.Sawtooth:
      return {
        type: SampleType.Sawtooth,
        amplitude: -amplitude,
        noise: 0,
        offset: snapY - (1 / gridSizeY) * 2,
        period: 1,
      };
    case WaveEditorWaveType.FSawtooth:
      return {
        type: SampleType.Sawtooth,
        amplitude: amplitude,
        noise: 0,
        offset: snapY,
        period: 1,
      };
    // case WaveEditorWaveType.Noise:
    //   const noiseLevel = 1 - Math.abs(y);
    //   return {
    //     ...currentSample,
    //     noise: noiseLevel,
    //   };
    // default:
    //   return currentSample;
  }
}