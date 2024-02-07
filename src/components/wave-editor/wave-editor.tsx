import { play, stop } from "../../utils/audio-processing";

export function WaveEditor() {
    const handlePlay = () => {
        play(400);
    };

    const handleStop = () => {
        stop();
    };

    return (
        <>
            <button onClick={handlePlay}>Play</button>
            <button onClick={handleStop}>Stop</button>
        </>
    );
}
