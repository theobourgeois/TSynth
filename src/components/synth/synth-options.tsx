import { useSynthStore } from "../../utils/synth-utils";
import { EnvelopeOptions } from "./envelope-options";
import { FilterOptions } from "./filter-option";
import { LFOOptions } from "./lfo-options";
import { OscillatorOptions } from "./oscillator-options";

export function SynthOptions() {
    const oscillator1 = useSynthStore((state) => state.oscillator1);
    const oscillator2 = useSynthStore((state) => state.oscillator2);
    const setOscillator1 = useSynthStore((state) => state.setOscillator1);
    const setOscillator2 = useSynthStore((state) => state.setOscillator2);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-4">
                <OscillatorOptions
                    oscillator={oscillator1}
                    onChange={setOscillator1}
                    oscillatorNumber={1}
                />
                <OscillatorOptions
                    oscillator={oscillator2}
                    onChange={setOscillator2}
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
