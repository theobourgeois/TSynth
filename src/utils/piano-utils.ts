enum Note {
  C = "c",
  CSharp = "c#",
  D = "d",
  DSharp = "d#",
  E = "e",
  F = "f",
  FSharp = "f#",
  G = "g",
  GSharp = "g#",
  A = "a",
  ASharp = "a#",
  B = "b",
}

export const NOTES = {
  [Note.C]: 16,
  [Note.CSharp]: 17.32,
  [Note.D]: 18.35,
  [Note.DSharp]: 19.45,
  [Note.E]: 20.6,
  [Note.F]: 21.83,
  [Note.FSharp]: 23.12,
  [Note.G]: 24.5,
  [Note.GSharp]: 25.96,
  [Note.A]: 27.5,
  [Note.ASharp]: 29.14,
  [Note.B]: 30.87,
};

export const keyToNoteMap: Record<string, number> = {
  'q': getNoteFrequency(Note.C, 5),
  '2': getNoteFrequency(Note.CSharp, 5),
  'w': getNoteFrequency(Note.D, 5),
  '3': getNoteFrequency(Note.DSharp, 5),
  'e': getNoteFrequency(Note.E, 5),
  'r': getNoteFrequency(Note.F, 5),
  '5': getNoteFrequency(Note.FSharp, 5),
  't': getNoteFrequency(Note.G, 5),
  '6': getNoteFrequency(Note.GSharp, 5),
  'y': getNoteFrequency(Note.A, 5),
  '7': getNoteFrequency(Note.ASharp, 5),
  'u': getNoteFrequency(Note.B, 5),
  'i': getNoteFrequency(Note.C, 6),
  '9': getNoteFrequency(Note.CSharp, 6),
  'o': getNoteFrequency(Note.D, 6),
  '0': getNoteFrequency(Note.DSharp, 6),
  'p': getNoteFrequency(Note.E, 6),
  '[': getNoteFrequency(Note.F, 6),
  '=': getNoteFrequency(Note.FSharp, 6),
  ']': getNoteFrequency(Note.G, 6),
  'z': getNoteFrequency(Note.C, 4),
  's': getNoteFrequency(Note.CSharp, 4),
  'x': getNoteFrequency(Note.D, 4),
  'd': getNoteFrequency(Note.DSharp, 4),
  'c': getNoteFrequency(Note.E, 4),
  'v': getNoteFrequency(Note.F, 4),
  'g': getNoteFrequency(Note.FSharp, 4),
  'b': getNoteFrequency(Note.G, 4),
  'h': getNoteFrequency(Note.GSharp, 4),
  'n': getNoteFrequency(Note.A, 4),
  'j': getNoteFrequency(Note.ASharp, 4),
  'm': getNoteFrequency(Note.B, 4),
  ',': getNoteFrequency(Note.C, 5),
  'l': getNoteFrequency(Note.CSharp, 5),
  '.': getNoteFrequency(Note.D, 5),
  ';': getNoteFrequency(Note.DSharp, 5),
  '/': getNoteFrequency(Note.E, 5)
};


export function getNoteFrequency(note: Note, octave: number) {
  const noteFrequency = NOTES[note];
  return noteFrequency * Math.pow(2, octave);
}


