import { useSynth } from "../../utils/synth-utils";
import { Knob } from "./knob";

export function MasterKnob() {
    const { master, setMaster } = useSynth();
    const handleChange = (value: number) => {
        setMaster(value);
    };
    return (
        <div className="scale-[1.3]">
            <Knob onChange={handleChange} value={master} isMaster />
        </div>
    );
}
