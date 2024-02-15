import { useEffect } from "react";
import { keyToNoteMap } from "../../utils/piano-utils";
import { audioProcessor } from "../../utils/audio-processing";

export function Piano() {
    useEffect(() => {
        const keysCurrentlyPressed = {};

        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key;
            // Check if the key is already pressed and ignore if it is
            if (keysCurrentlyPressed[key]) {
                return;
            }
            keysCurrentlyPressed[key] = true; // Mark the key as pressed

            const freq = keyToNoteMap[key];
            if (freq) {
                audioProcessor.play(freq);
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            const key = e.key;
            keysCurrentlyPressed[key] = false;
            const freq = keyToNoteMap[key];
            audioProcessor.stop(freq);
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    return <></>;
}
