import {
    ThemeTypes,
    createStyles,
    themes,
    useThemeStore,
} from "../../utils/theme-utils";
import { IconBxsPalette } from "../icons/icons";

const useStyles = createStyles((theme) => ({
    select: {
        background: theme.tvHighlight,
        color: theme.text,
        padding: "0.3em 0.5em",
        borderRadius: "0.5em",
    },
}));

export function SynthSettings() {
    return (
        <div className="flex gap-2 items-center px-4 pt-4">
            <ThemeSelector />
        </div>
    );
}

function ThemeSelector() {
    const themeName = useThemeStore((state) => state.themeName);
    const setTheme = useThemeStore((state) => state.setTheme);
    const styles = useStyles();

    const handleChangeName = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const themeName = e.target.value as ThemeTypes;
        setTheme(themeName);
    };

    return (
        <div className="flex gap-1 items-center" style={styles.select}>
            <IconBxsPalette
                width="1.5em"
                height="1.5em"
                color="rgba(255, 255, 255, 0.6)"
            />
            <select
                className="bg-transparent outline-none border-none"
                value={themeName}
                onChange={handleChangeName}
            >
                {Object.keys(themes).map((themeName) => (
                    <option key={themeName} value={themeName}>
                        {themeName}
                    </option>
                ))}
            </select>
        </div>
    );
}
