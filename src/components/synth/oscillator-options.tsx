import {
    Oscillator,
    getDenormalizedAudioLevel,
    getDenormalizedUnison,
} from "../../utils/synth-utils";
import { KnobText } from "../knob/knob-text";
import { OptionWrapper } from "./border";

type OscillatorOptionsProps = {
    oscillator: Oscillator;
    onChange: (oscillator: Oscillator) => void;
    oscillatorNumber: number;
};

export function OscillatorOptions({
    oscillator,
    onChange,
    oscillatorNumber,
}: OscillatorOptionsProps) {
    const handleChangeOscillator =
        <T extends keyof Oscillator>(options: T) =>
        (value: Oscillator[T]) => {
            onChange({
                ...oscillator,
                [options]: value,
            });
        };

    return (
        <OptionWrapper
            className="flex-grow"
            enabled={oscillator.enabled}
            title={`OSC ${oscillatorNumber}`}
        >
            <div className="gap-4 grid grid-cols-2">
                <KnobText
                    title="UNISON"
                    value={oscillator.unison}
                    onChange={handleChangeOscillator("unison")}
                    indicatorText={(value) =>
                        getDenormalizedUnison(value).toFixed(0)
                    }
                />
                <KnobText
                    title="DETUNE"
                    value={oscillator.detune}
                    onChange={handleChangeOscillator("detune")}
                />
                <KnobText
                    title="LEVEL"
                    value={oscillator.level}
                    onChange={handleChangeOscillator("level")}
                    indicatorText={(value) =>
                        getDenormalizedAudioLevel(value).toFixed(0) + " Db"
                    }
                />
                <KnobText
                    title="PAN"
                    value={oscillator.pan}
                    onChange={handleChangeOscillator("pan")}
                />
            </div>
        </OptionWrapper>
    );
}
