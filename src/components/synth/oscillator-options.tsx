import {
    LFOAttachement,
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
            onEnabledChange={handleChangeOscillator("enabled")}
        >
            <div className="gap-4 grid grid-cols-2">
                <KnobText
                    title="UNISON"
                    attachment={
                        oscillatorNumber === 1
                            ? LFOAttachement.UNISON_OSC1
                            : LFOAttachement.UNISON_OSC2
                    }
                    value={oscillator.unison}
                    onChange={handleChangeOscillator("unison")}
                    indicatorText={(value) =>
                        getDenormalizedUnison(value).toFixed(0)
                    }
                />
                <KnobText
                    title="DETUNE"
                    attachment={
                        oscillatorNumber === 1
                            ? LFOAttachement.DETUNE_OSC1
                            : LFOAttachement.DETUNE_OSC2
                    }
                    value={oscillator.detune}
                    onChange={handleChangeOscillator("detune")}
                />
                <KnobText
                    title="LEVEL"
                    attachment={
                        oscillatorNumber === 1
                            ? LFOAttachement.LEVEL_OSC1
                            : LFOAttachement.LEVEL_OSC2
                    }
                    value={oscillator.level}
                    onChange={handleChangeOscillator("level")}
                    indicatorText={(value) =>
                        getDenormalizedAudioLevel(value).toFixed(0) + " Db"
                    }
                />
                <KnobText
                    title="PAN"
                    attachment={
                        oscillatorNumber === 1
                            ? LFOAttachement.PAN_OSC1
                            : LFOAttachement.PAN_OSC2
                    }
                    value={oscillator.pan}
                    onChange={handleChangeOscillator("pan")}
                />
            </div>
        </OptionWrapper>
    );
}
