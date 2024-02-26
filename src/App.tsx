import { Synth } from "./components/synth/synth";

function App() {
    return (
        <div className="flex bg-slate-700 items-center justify-center h-screen">
            <div
                className="absolute flex items-center justify-center"
                onContextMenu={(e) => e.preventDefault()}
            >
                <Synth />
            </div>
        </div>
    );
}

export default App;
