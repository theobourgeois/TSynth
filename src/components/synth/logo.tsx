import { createStyles } from "../../utils/theme-utils";

const useStyles = createStyles((theme) => ({
    logo: {
        color: theme.logo,
    },
}));

export function Logo() {
    const styles = useStyles();
    return (
        <h1 style={styles.logo} className="text-5xl mb-4 w-max select-none">
            TSYNTH
        </h1>
    );
}
