import { useEffect, useState } from "react";
import { SampleType, WaveData, useSynth } from "../../utils/synth-utils";
import { WaveEditor } from "../wave-editor/wave-editor";
import { audioProcessor } from "../../utils/audio-processing";

const sampleTypes = Object.values(SampleType);
const randBool = () => (Math.random() > 0.5 ? -1 : 1);

const mockData: WaveData = {
    sampleCount: 4,
    samples: [
        {
            period: 1,
            type: sampleTypes[Math.floor(Math.random() * sampleTypes.length)],
            amplitude: Math.random() * randBool() * 0.5,
            noise: 0,
            offset: 0,
        },
        {
            period: 2,
            type: sampleTypes[Math.floor(Math.random() * sampleTypes.length)],
            amplitude: Math.random() * randBool() * 0.5,
            noise: 0,
            offset: 0,
        },
        {
            period: 1,
            type: sampleTypes[Math.floor(Math.random() * sampleTypes.length)],
            amplitude: Math.random() * randBool() * 0.5,
            noise: 0,
            offset: 0,
        },
    ],
};

export function Synth() {
    const synth = useSynth();
    const [data, setData] = useState(mockData);

    // when the synth state changes, update the processor's state
    useEffect(() => {
        const payload = {
            oscillator1: synth.oscillator1,
            oscillator2: synth.oscillator2,
            envelope: synth.envelope,
            LFO: synth.LFO,
            filter: synth.filter,
        };
        audioProcessor.setProcessorData(payload);

        return () => {
            audioProcessor.stopAudioProcessor();
        };
    }, [synth]);

    const handleChange = (samples: WaveData["samples"]) => {
        setData({
            ...data,
            samples,
        });
    };

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
            <WaveEditor
                gridSizeX={4}
                gridSizeY={6}
                data={data}
                onChangeSamples={handleChange}
            />
        </div>
    );
}
