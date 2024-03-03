import { createStyles } from "../../utils/theme-utils";
import { SynthSettings } from "./synth-settings";

const useStyles = createStyles((theme) => ({
    bg: {
        background: `linear-gradient(0deg, ${theme.tvBackground} 0%, ${theme.tvHighlight} 75%, ${theme.tvBackground} 100%)`,
    },
}));

// component that shows synth settings
export function SynthWrapper({ children }: { children: React.ReactNode }) {
    const styles = useStyles();
    return (
        <div style={styles.bg}>
            <div className="absolute left-0 top-0">
                <SynthSettings />
            </div>
            <div className="flex items-center justify-center h-screen">
                {children}
            </div>
        </div>
    );
}
