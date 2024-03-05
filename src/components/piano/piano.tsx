import { RefObject, useEffect, useRef, useState } from "react";
import {
    NOTES,
    Note,
    keyToNoteMap,
    useKeysCurrentlyPressed,
} from "../../utils/piano-utils";
import { audioProcessor } from "../../utils/audio-processing";
import { createStyles } from "../../utils/theme-utils";

const OCTAVE_COUNT = 5;
const KEYS_PER_OCTAVE = 12;
const NUM_OF_KEYS = OCTAVE_COUNT * KEYS_PER_OCTAVE;

type KeyProps = {
    keyIndex: number;
    isKeyboardKeyBeingPressed: boolean;
    onPressKey: (frequency: number) => void;
    onLetGoKey: (frequency: number) => void;
};

const useStyles = createStyles((theme, isKeyPressed) => ({
    piano: {
        padding: "15px",
        backgroundColor: theme.background,
        borderRadius: "9px",
        boxShadow:
            "inset 0px 2px 2px -4px #000, inset 0px -4px 4px 0px rgba(0, 0, 0, 0.25)",
    },
    whiteKey: {
        boxShadow: "inset 0 0 2px rgba(0, 0, 0, 0.9)",
        borderLeft: `1px solid ${theme.tvScreenOutline}`,
        borderRight: `1px solid ${theme.tvScreenOutline}`,
        borderRadius: "0 0 5px 5px",
        background: isKeyPressed
            ? "linear-gradient(180deg, rgba(166,166,166,1) 0%, rgba(255,255,255,1) 16%, rgba(166,166,166,1) 100%)"
            : "linear-gradient(180deg, rgba(166,166,166,1) 0%, rgba(255,255,255,1) 16%, rgba(242,242,242,1) 100%)",
    },
    blackKey: {
        boxShadow: isKeyPressed
            ? "inset 0 6px 1px rgba(0,0,0, 1), inset 0 -6px 4px rgba(0,0,0,1)"
            : "inset 0 4px 1px rgba(0,0,0, 1), inset 0 -6px 4px rgba(0,0,0,0.5)",
        border: `1px solid ${theme.tvScreenOutline}`,
        background: isKeyPressed
            ? "linear-gradient(180deg, rgba(80,80,80,1) 0%, rgba(50,50,50,1) 100%)"
            : "linear-gradient(180deg, rgba(100,100,100,1) 0%, rgba(50,50,50,1) 100%)",
    },
}));

function isBlackKey(keyIndex: number) {
    const noteInOctave = keyIndex % KEYS_PER_OCTAVE;
    switch (noteInOctave) {
        case 1:
        case 3:
        case 6:
        case 8:
        case 10:
            return true;
    }
    return false;
}

function getFrequencyFromKeyIndex(keyIndex: number) {
    const octave = Math.floor(keyIndex / KEYS_PER_OCTAVE) + 2;
    const noteInOctave = keyIndex % KEYS_PER_OCTAVE;
    const note = Object.keys(NOTES)[noteInOctave] as Note;
    const freq = NOTES[note] * Math.pow(2, octave);
    return freq;
}

export function Piano() {
    const styles = useStyles();
    const { keysCurrentlyPressed, addKey, removeKey } =
        useKeysCurrentlyPressed();
    const keysCurrentlyPressedRef = useRef(keysCurrentlyPressed);

    useEffect(() => {
        const isInputElement = (e: Event) => {
            const target = e.target as HTMLElement;
            return (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.isContentEditable
            );
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            const isOnInputElement = isInputElement(e);
            if (isOnInputElement) {
                return;
            }
            const key = e.key.toLowerCase();
            // Check if the key is already pressed and ignore if it is
            const keysCurrentlyPressed = keysCurrentlyPressedRef.current;
            const freq = keyToNoteMap[key];
            if (keysCurrentlyPressed[freq]) {
                return;
            }

            addKey(freq);
            if (freq) {
                audioProcessor.play(freq);
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            const isOnInputElement = isInputElement(e);
            if (isOnInputElement) {
                return;
            }
            const key = e.key.toLowerCase();
            const freq = keyToNoteMap[key];

            removeKey(freq);
            audioProcessor.stop(freq);
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    useEffect(() => {
        keysCurrentlyPressedRef.current = keysCurrentlyPressed;
    }, [keysCurrentlyPressed]);

    const handlePressKey = (frequency: number) => {
        audioProcessor.play(frequency);
    };

    const handleLetGoKey = (frequency: number) => {
        audioProcessor.stop(frequency);
    };

    return (
        <div className="flex w-full justify-center" style={styles.piano}>
            {Array.from({ length: NUM_OF_KEYS }).map((_, keyIndex) => {
                if (isBlackKey(keyIndex)) {
                    return (
                        <BlackKey
                            isKeyboardKeyBeingPressed={
                                keysCurrentlyPressed[
                                    getFrequencyFromKeyIndex(keyIndex)
                                ]
                            }
                            onPressKey={handlePressKey}
                            onLetGoKey={handleLetGoKey}
                            keyIndex={keyIndex}
                            key={keyIndex}
                        ></BlackKey>
                    );
                }
                return (
                    <WhiteKey
                        isKeyboardKeyBeingPressed={
                            keysCurrentlyPressed[
                                getFrequencyFromKeyIndex(keyIndex)
                            ]
                        }
                        onPressKey={handlePressKey}
                        onLetGoKey={handleLetGoKey}
                        keyIndex={keyIndex}
                        key={keyIndex}
                    ></WhiteKey>
                );
            })}
        </div>
    );
}

function BlackKey({
    onLetGoKey,
    onPressKey,
    keyIndex,
    isKeyboardKeyBeingPressed,
}: KeyProps) {
    const keyRef = useRef<HTMLDivElement>(null);
    const isKeyPressed = useKeyHandler(
        keyRef,
        onPressKey,
        onLetGoKey,
        keyIndex
    );
    const styles = useStyles(isKeyPressed || isKeyboardKeyBeingPressed);

    return (
        <div className="relative">
            <div className="absolute right-1/2 translate-x-1/2">
                <div
                    ref={keyRef}
                    style={styles.blackKey}
                    className="bg-black h-16 w-4 cursor-pointer"
                ></div>
            </div>
        </div>
    );
}

function WhiteKey({
    onLetGoKey,
    onPressKey,
    keyIndex,
    isKeyboardKeyBeingPressed,
}: KeyProps) {
    const keyRef = useRef<HTMLDivElement>(null);
    const isKeyPressed = useKeyHandler(
        keyRef,
        onPressKey,
        onLetGoKey,
        keyIndex
    );
    const styles = useStyles(isKeyPressed || isKeyboardKeyBeingPressed);

    return (
        <div
            ref={keyRef}
            style={styles.whiteKey}
            className="bg-white h-[100px] w-9 cursor-pointer"
        ></div>
    );
}

// Custom hook to handle key press and letting go of a piano key
function useKeyHandler(
    keyRef: RefObject<HTMLDivElement>,
    onPressKey: (frequency: number) => void,
    onLetGoKey: (frequency: number) => void,
    keyIndex: number
) {
    const frequency = getFrequencyFromKeyIndex(keyIndex);
    const [isKeyPressed, setIsKeyPressed] = useState(false);
    const keyPresedRef = useRef(false);

    useEffect(() => {
        const handleMouseDown = () => {
            setIsKeyPressed(true);
            onPressKey(frequency);
        };
        const handleMouseUp = () => {
            if (!keyPresedRef.current) return;
            setIsKeyPressed(false);
            onLetGoKey(frequency);
        };
        const handleMouseEnter = (e: MouseEvent) => {
            if (e.buttons === 1) {
                handleMouseDown();
            }
        };
        const key = keyRef.current;
        key?.addEventListener("mousedown", handleMouseDown);
        key?.addEventListener("mouseup", handleMouseUp);
        key?.addEventListener("mouseleave", handleMouseUp);
        key?.addEventListener("mouseenter", handleMouseEnter);
        return () => {
            key?.removeEventListener("mousedown", handleMouseDown);
            key?.removeEventListener("mouseup", handleMouseUp);
            key?.removeEventListener("mouseleave", handleMouseUp);
            key?.removeEventListener("mouseenter", handleMouseEnter);
        };
    }, [keyRef, onPressKey, onLetGoKey, frequency]);

    useEffect(() => {
        keyPresedRef.current = isKeyPressed;
    }, [isKeyPressed]);

    return isKeyPressed;
}
