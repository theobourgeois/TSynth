import { useEffect } from "react";
import { useSynth } from "../../utils/synth-utils";
import { audioProcessor } from "../../utils/audio-processing";
import { Oscillator } from "../oscillator/oscillator";

export function Synth() {
    const synth = useSynth();
    const { oscillator1, setOscillator1 } = synth;

    // when the synth state changes, update the processor's state
    useEffect(() => {
        const { oscillator1, oscillator2, envelope, LFO, filter } = synth;
        const payload = {
            oscillator1,
            oscillator2,
            envelope,
            LFO,
            filter,
        };
        audioProcessor.setProcessorData(payload);
    }, [synth]);

    return (
        <div className="w-full h-full">
            <button
                onMouseDown={() =>
                    audioProcessor.play(Math.random() * (500 - 200) + 200)
                }
                onMouseUp={() => audioProcessor.stop()}
            >
                Play
            </button>
            <Oscillator
                oscillator={oscillator1}
                onChange={(oscillator) => setOscillator1(oscillator)}
            />
        </div>
    );
}
