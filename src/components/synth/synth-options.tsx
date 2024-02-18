import { useSynth } from "../../utils/synth-utils";
import { EnvelopeOptions } from "./envelope-options";
import { FilterOptions } from "./filter-option";
import { LFOOptions } from "./lfo-options";
import { OscillatorOptions } from "./oscillator-options";

export function SynthOptions() {
    const synth = useSynth();
    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-4">
                <OscillatorOptions
                    oscillator={synth.oscillator1}
                    onChange={synth.setOscillator1}
                    oscillatorNumber={1}
                />
                <OscillatorOptions
                    oscillator={synth.oscillator2}
                    onChange={synth.setOscillator2}
                    oscillatorNumber={2}
                />
            </div>
            <div className="flex gap-4">
                <FilterOptions />
                <LFOOptions />
            </div>
            <div>
                <EnvelopeOptions />
            </div>
        </div>
    );
}
