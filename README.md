# TSynth Documentation

## Overview

TSynth is a synthesizer application developed for web platforms. It aims to provide users with comprehensive tools for sound design and synthesis through a web interface. 

## Features

### Oscillators
- **Dual Oscillators**: TSynth includes two oscillators, enabling the generation of complex sounds. Users can customize the waveform of each oscillator, allowing for a broad spectrum of sound textures.

### Envelope Controls
- **Envelope Parameters**: Users can manipulate the sound's dynamics with detailed control over Attack, Hold, Decay, Sustain, and Release parameters. 

### Low-Frequency Oscillator (LFO)
- **LFO Modulation**: The Low-Frequency Oscillator can modulate any parameter within TSynth. User's can customize the LFO's shape to allow for a highly dynamic sound.

### Themes
- **Customizable Themes**: TSynth supports theme customization, allowing users to personalize their interface. Four initial themes are available, with the option to create custom themes. Additional themes will be introduced in future updates.

### MIDI Support
- **MIDI Keyboard Integration**: The application provides support for MIDI keyboards.

### Recording
- **Audio Recording**: Users can record and download their audio directly from TSynth.

## Customizing Themes

To add a custom theme:

1. In the `src/themes` directory, create a new JSON file.
2. Copy the contents of `default.json` into your new file as a starting point.
3. Modify the JSON file to define your theme, adjusting colors and styles as desired.
4. Import your theme file into `src/utils/theme-utils.ts` and add a corresponding entry to the `themes` variable to make it available within TSynth.

TSynth is designed to be a flexible tool for web-based sound synthesis, providing users with a rich set of features for creating and manipulating sounds. As an evolving project, feedback and contributions are welcome to enhance and expand its capabilities.

