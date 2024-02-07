import { Synth } from "./components/synth/synth";
import { audioContext, audioProcessingNode } from "./utils/audio-processing";

async function loadAndUseCustomOscillator() {
    if (audioContext.state === "suspended") {
        await audioContext.resume();
    }
    audioProcessingNode.connect(audioContext.destination);

    // Animate the mix parameter from 0 (sine wave) to 1 (square wave) over 10 seconds
    const now = audioContext.currentTime;
    audioProcessingNode.parameters.get("mix").setValueAtTime(0, now);
    audioProcessingNode.parameters
        .get("mix")
        .linearRampToValueAtTime(1, now + 10);
}

function App() {
    return (
        <div className="flex items-center justify-center h-screen">
            <Synth />
        </div>
    );
}

export default App;
