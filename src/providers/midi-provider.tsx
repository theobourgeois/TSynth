/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createContext, useContext, useEffect, useState } from "react";
import { audioProcessor } from "../utils/audio-processing";
import { MIDIMessageCommand } from "../utils/midi-utils";
import {
    NOTES,
    Note,
    getNoteFrequency,
    useKeysCurrentlyPressed,
} from "../utils/piano-utils";

type MIDIContextType = {
    MIDIDevices: MIDIInput[];
    selectedMIDIDevice: MIDIInput | undefined;
    setSelectedMIDIDevice: (device: MIDIInput) => void;
};

export const MIDIContext = createContext<MIDIContextType>(
    {} as MIDIContextType
);

export function useMIDI() {
    const context = useContext(MIDIContext);
    if (!context) {
        throw new Error("useMIDI must be used within a MIDIProvider");
    }
    return context;
}

export function MIDIProvider({ children }: { children: React.ReactNode }) {
    const { addKey, removeKey } = useKeysCurrentlyPressed();
    const [MIDIDevices, setMIDIDevices] = useState<MIDIInput[]>([]);
    const [selectedMIDIDevice, setSelectedMIDIDevice] = useState<MIDIInput>();

    useEffect(() => {
        const onMIDISuccess = (midiAccess: MIDIAccess) => {
            midiAccess.onstatechange = (state) => {
                onMIDISuccess(state.currentTarget as MIDIAccess);
            };
            const inputs = midiAccess.inputs.values();
            const inputArray: MIDIInput[] = [];
            for (
                let input = inputs.next();
                input && !input.done;
                input = inputs.next()
            ) {
                inputArray.push(input.value);
            }

            const localStorageSelectedMIDIDevice =
                localStorage.getItem("selectedMIDIDevice");
            if (localStorageSelectedMIDIDevice) {
                const selectedDevice = inputArray.find(
                    (device) => device.id === localStorageSelectedMIDIDevice
                );
                if (selectedDevice) {
                    setSelectedMIDIDevice(selectedDevice);
                } else {
                    setSelectedMIDIDevice(inputArray[0]);
                }
            } else {
                setSelectedMIDIDevice(inputArray[0]);
            }

            setMIDIDevices(inputArray);
        };

        const onMIDIFailure = (msg: string) => {
            console.error(`Failed to get MIDI access - ${msg}`);
        };

        navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    }, []);

    useEffect(() => {
        localStorage.setItem(
            "selectedMIDIDevice",
            selectedMIDIDevice?.id || ""
        );
        const onMIDIMessage = (event: MIDIMessageEvent) => {
            const [command, note] = event.data;
            const octave = Math.floor(note / 12) - 1;
            const noteName = Object.keys(NOTES)[note % 12] as Note;
            const frequency = getNoteFrequency(noteName, octave);

            switch (command) {
                case MIDIMessageCommand.NOTE_ON:
                    audioProcessor.play(frequency);
                    addKey(frequency);
                    break;
                case MIDIMessageCommand.NOTE_OFF:
                    removeKey(frequency);
                    audioProcessor.stop(frequency);
                    break;
            }
        };

        if (selectedMIDIDevice) {
            // @ts-expect-error
            selectedMIDIDevice.onmidimessage = onMIDIMessage;
        }

        return () => {
            if (selectedMIDIDevice) {
                selectedMIDIDevice.onmidimessage = null;
            }
        };
    }, [selectedMIDIDevice]);

    return (
        <MIDIContext.Provider
            value={{
                MIDIDevices,
                selectedMIDIDevice,
                setSelectedMIDIDevice,
            }}
        >
            {children}
        </MIDIContext.Provider>
    );
}
