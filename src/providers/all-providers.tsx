import { MIDIProvider } from "./midi-provider";
import { RecorderProvider } from "./recorder-provider";

export function AllProviders({ children }: { children: React.ReactNode }) {
    return (
        <RecorderProvider>
            <MIDIProvider>{children}</MIDIProvider>
        </RecorderProvider>
    );
}
