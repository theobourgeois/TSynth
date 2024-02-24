import { create } from "zustand";

export enum SampleType {
  Sine = "sine",
  Square = "square",
  Sawtooth = "sawtooth",
  Triangle = "triangle",
}

// data is an array of number from 0 to 1
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

type EnvelopeData = {
  x: number;
  y: number;
  curveX: number;
  curveY: number;
}

export type Envelope = {
  attack: EnvelopeData;
  hold: EnvelopeData;
  decay: EnvelopeData;
  release: EnvelopeData;
};

/**
 * initial values for the synth state
 */

const initialOsillator1: Oscillator = {
  enabled: true,
  wave: {
    data: Array.from({ length: 1024 }, (_, i) => Math.sin(i / 164)),
    octave: 0,
    semitone: 0,
    fine: 0,
  },
  semitone: 0,
  octave: 0,
  fine: 0,
  unison: 0,
  detune: 0,
  pan: 0.5,
  level: 1,
}

const initialOsillator2: Oscillator = {
  enabled: false,
  wave: {
    data: Array.from({ length: 1024 }, (_, i) => Math.sin(i / 164)),
    octave: 0,
    semitone: 0,
    fine: 0,
  },
  semitone: 0,
  octave: 0,
  fine: 0,
  unison: 0,
  detune: 0,
  pan: 0.5,
  level: 1,
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
  attack: {
    x: 0,
    y: 0,
    curveX: 0,
    curveY: 0,
  },
  hold: {
    x: 0.1,
    y: 0,
    curveX: 0,
    curveY: 0,
  },
  decay: {
    x: 0.3,
    y: 0.7,
    curveX: 0,
    curveY: 0,
  },
  release: {
    x: 0.5,
    y: 0,
    curveX: 0,
    curveY: 0,
  },
}

export interface SynthState {
  master: number;
  oscillator1: Oscillator;
  oscillator2: Oscillator;
  filter: Filter;
  LFO: LFO;
  envelope: Envelope;
}

export interface SynthStore extends SynthState {
  setMaster: (master: number) => void;
  setOscillator1: (oscillator: Oscillator) => void;
  setOscillator2: (oscillator: Oscillator) => void;
  setFilter: (filter: Filter) => void;
  setLFO: (LFO: LFO) => void;
  setEnvelope: (envelope: Envelope) => void;
}

const useSynthStore = create<SynthStore>((set) => ({
  master: 0.1,
  oscillator1: initialOsillator1,
  oscillator2: initialOsillator2,
  filter: initialFilter,
  LFO: initialLFO,
  envelope: initialEnvelope,
  setMaster: (master: number) => set({ master }),
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
}

/**
 * Get the sample data from the wave type. 
 * Used to draw the wave in the WaveEditor, depending on what type of wave is selected
 * @param type The type of wave
 * @param gridSizeY The number of grid lines in the Y axis
 * @param snapY The Y coordinate, snapped to the grid 
 * @returns 
 */
export function getSampleDataFromType(
  type: WaveEditorWaveType,
  gridSizeY: number,
  snapY: number,
) {
  // when the y is at the bottom of the grid, set the amplitude to 0
  // this will result in a flat line at the bottom of the grid
  const amplitude = snapY === -1 ? 0 : (1 / gridSizeY) * 2
  const positiveWaveOffset = snapY - (1 / gridSizeY) * 2

  switch (type) {
    case WaveEditorWaveType.Sine:
      return {
        type: SampleType.Sine,
        amplitude: -amplitude,
        noise: 0,
        offset: positiveWaveOffset,
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
        offset: positiveWaveOffset,
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
        offset: positiveWaveOffset,
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
  }
}

/**
 * get level of audio in Db from normalized level
 * @param normalizedLevel value from 0 to 1
 */
export function getDenormalizedAudioLevel(normalizedLevel: number) {
  const minDb = -60;
  const maxDb = 0;

  const minLevel = Math.pow(10, minDb / 20);
  const maxLevel = Math.pow(10, maxDb / 20);

  const level = minLevel + (maxLevel - minLevel) * normalizedLevel;
  const decibels = 20 * Math.log10(level);
  return decibels
}

/**
 * Get time in ms from normalized time. 
 * Used for time in the envelope
 * @param normalizedMs value from 0 to 1
 * @returns time in ms
 */
export function getDenormalizedMs(normalizedMs: number) {
  const minMs = 0.01;
  const maxMs = 3000;

  return minMs + (maxMs - minMs) * normalizedMs;
}

/**
 * get unison from denormalized value
 * @param normalizedUnison number from 0 to 1 
 * @returns 
 */
export function getDenormalizedUnison(normalizedUnison: number) {
  return Math.floor(normalizedUnison * 15) + 1;
}

export function denormalizeEnvelope(envelope: Envelope) {
  const attack = {
    ...envelope.attack,
    x: getDenormalizedMs(envelope.attack.x),
  }

  const hold = {
    ...envelope.hold,
    x: getDenormalizedMs(envelope.hold.x),
  }

  const decay = {
    ...envelope.decay,
    x: getDenormalizedMs(envelope.decay.x),
    y: 1 - envelope.decay.y,
  }

  const release = {
    ...envelope.release,
    x: getDenormalizedMs(envelope.release.x),
  }

  return {
    attack,
    hold,
    decay,
    release,
  }
}

function getDenormalizedOscillator(oscillator: Oscillator) {
  const detune = oscillator.detune * 100;
  const pan = oscillator.pan * 2 - 1;
  const unison = getDenormalizedUnison(oscillator.unison)

  return {
    ...oscillator,
    detune,
    pan,
    unison,
  }
}

/**
 * each value in the synth state is normalized between 0 and 1 for easier processing
 * this function converts the normalized values to their correct value units
 * @param synth 
 * @returns synth with correct values
 */
export function denormalizeSynthValues(synth: SynthState) {
  const envelope = denormalizeEnvelope(synth.envelope);
  const oscillator1 = getDenormalizedOscillator(synth.oscillator1);
  const oscillator2 = getDenormalizedOscillator(synth.oscillator2);

  return {
    ...synth,
    envelope,
    oscillator1,
    oscillator2,
  }
}