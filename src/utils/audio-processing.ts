import { SynthState } from "./synth-utils";
import { FFmpeg } from '@ffmpeg/ffmpeg';

export class AudioProcessor {
  audioContext: AudioContext;
  audioProcessingNode: AudioWorkletNode | undefined;
  sampleBufferListener: ((buffer: Float32Array) => void) | undefined;

  constructor() {
    this.audioContext = new AudioContext();
  }

  async setProcessorData(data: Omit<SynthState, "LFO">) {
    if (!this.audioProcessingNode) {
      await this.startAudioWorklets();
    }
    this.audioProcessingNode?.port.postMessage(data);
    if (!this?.audioProcessingNode?.port) return;
    this.audioProcessingNode.port.onmessage = (event) => {
      const sampleBuffer = event.data.sampleBuffer;
      if (sampleBuffer) {
        this.sampleBufferListener?.(sampleBuffer);
      }
    };
  }

  createMediaRecorder() {
    const dest = this.audioContext.createMediaStreamDestination();
    this.audioProcessingNode?.connect(dest);
    const mediaRecorder = new MediaRecorder(dest.stream);

    return mediaRecorder;
  }

  startAudioProcessor() {
    this.audioProcessingNode?.connect(this.audioContext.destination);
  }

  stopAudioProcessor() {
    if (!this.audioProcessingNode) {
      return;
    }
    this.audioProcessingNode?.disconnect();
  }

  play(frequency: number) {
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }
    this.audioProcessingNode?.parameters
      ?.get("playing")
      ?.setValueAtTime(1, this.audioContext.currentTime);
    this.audioProcessingNode?.port.postMessage({ addFrequency: frequency });
  }

  stop(freq?: number) {
    //this.audioProcessingNode?.parameters?.get("playing")?.setValueAtTime(0, this.audioContext.currentTime);
    if (freq) {
      this.audioProcessingNode?.port.postMessage({
        removeFrequency: freq,
      });
    }
  }

  setSampleBufferListener(callback: (buffer: Float32Array) => void) {
    this.sampleBufferListener = callback;
  }

  async startAudioWorklets() {
    await this.audioContext.audioWorklet.addModule(
      "src/worklets/audio-processor.js"
    );
    if (this.audioProcessingNode) {
      this.stopAudioProcessor();
    }
    this.audioProcessingNode = new AudioWorkletNode(
      this.audioContext,
      "audio-processor",
      {
        numberOfOutputs: 1,
        outputChannelCount: [2],
      }
    );
    this.startAudioProcessor();
  }
}

export const audioProcessor = new AudioProcessor();


export async function convertWebmToMp3(webmBlob: Blob, fileName: string): Promise<Blob> {
  const ffmpeg = new FFmpeg()
  await ffmpeg.load();
  console.log('loaded')

  const inputName = `${fileName}.webm`;
  const outputName = `${fileName}.mp3`

  const inputData = await webmBlob.arrayBuffer().then((buffer) => new Uint8Array(buffer));

  ffmpeg.writeFile(inputName, inputData);

  await ffmpeg.exec(["-i", inputName, outputName]);

  const outputData = await ffmpeg.readFile(outputName);
  const outputBlob = new Blob([outputData], { type: 'audio/mp3' });

  return outputBlob;
}