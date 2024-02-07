import { useEffect } from "react";
import { useSynth } from "../../utils/synth-utils";
import {
    audioProcessingNode,
    setProcessorData,
    startAudioWorklets,
    stopAudioProcessor,
} from "../../utils/audio-processing";
import { WaveEditor } from "../wave-editor/wave-editor";

export function Synth() {
    const synth = useSynth();

    // when the synth state changes, update the processor's state
    useEffect(() => {
        const payload = {
            oscillator1: synth.oscillator1,
            oscillator2: synth.oscillator2,
            envelope: synth.envelope,
            LFO: synth.LFO,
            fitler: synth.filter,
        };
        async function init() {
            await startAudioWorklets();
            setProcessorData(payload);
        }
        if (!audioProcessingNode) {
            init();
        } else {
            setProcessorData(payload);
        }

        return () => {
            if (audioProcessingNode) {
                stopAudioProcessor();
            }
        };
    }, [synth]);

    return (
        <>
            <WaveEditor />
        </>
    );
}
