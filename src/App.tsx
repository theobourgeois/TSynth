import { SynthWrapper } from "./components/synth-settings/synth-wrapper";
import { Synth } from "./components/synth/synth";

function App() {
    return (
        <SynthWrapper>
            <div
                className="absolute top-4 flex items-center justify-center"
                onContextMenu={(e) => e.preventDefault()}
            >
                <Synth />
            </div>
        </SynthWrapper>
    );
}

export default App;
