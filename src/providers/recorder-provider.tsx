import { createContext, useContext, useState } from "react";
import { audioProcessor, convertWebmToMp3 } from "../utils/audio-processing";

type RecorderContextType = {
    startRecording: () => void;
    stopRecording: () => void;
    clearRecording: () => void;
    isDoneRecording: boolean;
    downloadRecording: (fileName: string) => void;
    isRecording: boolean;
    audioChunks: Blob[];
};

export const RecorderContext = createContext<RecorderContextType>(
    {} as RecorderContextType
);

export function useRecorder() {
    const context = useContext(RecorderContext);
    if (!context) {
        throw new Error("useRecorder must be used within a RecorderProvider");
    }
    return context;
}

export function RecorderProvider({ children }: { children: React.ReactNode }) {
    const [isRecording, setIsRecording] = useState(false);
    const [isDoneRecording, setIsDoneRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
        null
    );
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

    const startRecording = () => {
        setAudioChunks([]);
        const mediaRecorder = audioProcessor.createMediaRecorder();
        mediaRecorder.start(100);

        mediaRecorder.onerror = (event) => {
            console.error("MediaRecorder error:", event);
        };

        mediaRecorder.ondataavailable = (event) => {
            setAudioChunks((chunks) => [...chunks, event.data]);
        };

        setMediaRecorder(mediaRecorder);
        setIsDoneRecording(false);
        setIsRecording(true);
    };

    const stopRecording = () => {
        setIsDoneRecording(true);
        mediaRecorder?.stop();
        setIsRecording(false);
    };

    const downloadRecording = async (fileName: string) => {
        const audioBlob = new Blob(audioChunks, {
            type: "audio/webm;codecs=opus",
        });
        try {
            const mp3Blob = await convertWebmToMp3(audioBlob, fileName);
            const url = URL.createObjectURL(mp3Blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `${fileName}.mp3`;
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error(e);
        }
    };

    const clearRecording = () => {
        setAudioChunks([]);
        setIsDoneRecording(false);
    };

    return (
        <RecorderContext.Provider
            value={{
                isDoneRecording,
                isRecording,
                audioChunks,
                startRecording,
                stopRecording,
                downloadRecording,
                clearRecording,
            }}
        >
            {children}
        </RecorderContext.Provider>
    );
}
