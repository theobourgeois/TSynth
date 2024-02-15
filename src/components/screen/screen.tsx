import { Screens, useScreen } from "../../utils/screens-utils";
import { useSynth } from "../../utils/synth-utils";
import { createStyles } from "../../utils/theme-utils";
import { EnvelopeScreen } from "../envelope/envelope-screen";
import { FilterScreen } from "./filter-screen";
import { LFOScreen } from "./lfo-screen";
import { OscillatorScreen } from "../oscillator/oscillator-screen";

const useStyles = createStyles((theme) => ({
    screen: {
        width: "100%",
        height: "100%",
        padding: "0.7rem",
        background: `linear-gradient(0deg, ${theme.screenPrimary} 0%, ${theme.screenShine} 75%, ${theme.screenPrimary} 100%)`,
    },
}));

export function Screen() {
    const styles = useStyles();
    const { oscillator1, oscillator2, setOscillator1, setOscillator2 } =
        useSynth();
    const { activeScreen } = useScreen();
    const getActiveScreen = () => {
        switch (activeScreen) {
            case Screens.OSC1:
                return (
                    <OscillatorScreen
                        oscillator={oscillator1}
                        setOscillator={setOscillator1}
                        oscillatorNumber={1}
                    />
                );
            case Screens.OSC2:
                return (
                    <OscillatorScreen
                        oscillator={oscillator2}
                        setOscillator={setOscillator2}
                        oscillatorNumber={2}
                    />
                );
            case Screens.FILTER:
                return <FilterScreen />;
            case Screens.ENVELOPE:
                return <EnvelopeScreen />;
            case Screens.LFO:
                return <LFOScreen />;
            default:
                return null;
        }
    };

    return <div style={styles.screen}>{getActiveScreen()}</div>;
}
