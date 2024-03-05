import { useState } from "react";
import { useRecorder } from "../../providers/recorder-provider";
import { createStyles } from "../../utils/theme-utils";
import { Button, TextField } from "../screen/inputs";
import { RecordingWaveform } from "./recording-waveform";

const useStyles = createStyles((theme, isRecording) => ({
    title: {
        backgroundColor: theme.screenSecondary,
        color: theme.screenPrimary,
        padding: "0.2rem 0.5rem",
        fontSize: "1.3rem",
        borderRadius: "0.2rem",
    },
    recordIcon: {
        cursor: "pointer",
        width: "2rem",
        height: "2rem",
        backgroundColor: isRecording
            ? theme.screenPrimary
            : theme.screenSecondary,
        borderRadius: "50%",
    },
    recordIconInnerCircle: {
        width: "1rem",
        height: "1rem",
        backgroundColor: isRecording
            ? theme.screenSecondary
            : theme.screenPrimary,
        borderRadius: "50%",
        margin: "0.5rem",
    },
}));

export function Recorder() {
    const {
        isRecording,
        startRecording,
        stopRecording,
        isDoneRecording,
        downloadRecording,
        clearRecording,
    } = useRecorder();
    const styles = useStyles(isRecording);
    const [fileName, setFileName] = useState("File name");

    const handleToggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const handleChangeFileName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFileName(e.target.value);
    };

    return (
        <div className="flex flex-col gap-2">
            <p style={styles.title}>Record</p>
            <div className="flex items-center gap-2">
                <div onClick={handleToggleRecording} style={styles.recordIcon}>
                    <div style={styles.recordIconInnerCircle}></div>
                </div>
                {isDoneRecording && (
                    <div className="flex items-center gap-2">
                        <TextField
                            className="w-32"
                            value={fileName}
                            onChange={handleChangeFileName}
                            placeholder="Enter file name"
                        />
                        <Button
                            variant="secondary"
                            disabled={!fileName}
                            onClick={() => downloadRecording(fileName)}
                        >
                            Download
                        </Button>
                        <Button onClick={clearRecording}>Clear</Button>
                    </div>
                )}
            </div>
            <RecordingWaveform />
        </div>
    );
}
