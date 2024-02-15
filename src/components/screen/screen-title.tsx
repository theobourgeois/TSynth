import { createStyles } from "../../utils/theme-utils";

const useStyles = createStyles((theme) => ({
    title: {
        fontSize: "1.8rem",
        color: theme.screenPrimary,
    },
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 0.5rem",
        width: "max-content",
        backgroundColor: theme.screenSecondary,
    },
}));

export function ScreenTitle({ title }: { title: string }) {
    const styles = useStyles();
    return (
        <div style={styles.container}>
            <p style={styles.title}>{title}</p>
        </div>
    );
}
