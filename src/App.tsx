import { Piano } from "./components/piano/piano";
import { SynthWrapper } from "./components/synth-settings/synth-wrapper";
import { Synth } from "./components/synth/synth";

function App() {
    return (
        <SynthWrapper>
            <div
                className="flex flex-col items-center justify-center"
                onContextMenu={(e) => e.preventDefault()}
            >
                <Synth />
                <Piano />
            </div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2"></div>
        </SynthWrapper>
    );
}

export default App;
