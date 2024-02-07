import { useEffect } from "react";
import { useSynth } from "../../utils/synth-utils";
import { setProcessorData } from "../../utils/audio-processing";
import { WaveEditor } from "../wave-editor/wave-editor";

export function Synth() {
    const synth = useSynth();

    // when the synth state change, update the processor's state
    useEffect(() => {
        setProcessorData(synth);
    }, [synth]);

    return (
        <>
            <WaveEditor />
        </>
    );
}
