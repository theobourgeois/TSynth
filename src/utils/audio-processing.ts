import { SynthState } from "./synth-utils";
import { FFmpeg } from '@ffmpeg/ffmpeg';

export class AudioProcessor {
  audioContext: AudioContext | null = null;
  audioProcessingNode: AudioWorkletNode | undefined;
  sampleBufferListener: ((buffer: Float32Array) => void) | undefined;

  async setProcessorData(data: Omit<SynthState, "LFO">) {
    console.log({
      data, audioContext: this.audioContext, audioProcessingNode: this.audioProcessingNode
    })
    if (!this.audioContext) {
      return;
    }
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
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }
    const dest = this.audioContext.createMediaStreamDestination();
    this.audioProcessingNode?.connect(dest);
    const mediaRecorder = new MediaRecorder(dest.stream);

    return mediaRecorder;
  }

  startAudioProcessor() {
    if (!this.audioContext) {
      return;
    }
    this.audioProcessingNode?.connect(this.audioContext.destination);
  }

  stopAudioProcessor() {
    if (!this.audioProcessingNode) {
      return;
    }
    this.audioProcessingNode?.disconnect();
  }

  play(frequency: number) {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }
    this.audioProcessingNode?.parameters
      ?.get("playing")
      ?.setValueAtTime(1, this.audioContext.currentTime);
    this.audioProcessingNode?.port.postMessage({ addFrequency: frequency });
  }

  stop(freq?: number) {
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
    if (!this.audioContext) {
      return
    }
    console.log('startworklet', this.audioContext)

    try {

      await this.audioContext.audioWorklet.addModule(
        "src/worklets/audio-processor.js"
      );
    } catch (error) {
      console.error('Error starting worklet:', error)
    }

    console.log('started worklet')

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
    console.log('startworklet', this.audioProcessingNode)
    this.startAudioProcessor();
  }
}

export const audioProcessor = new AudioProcessor();

async function toBlobURL(url: string, mimeType: string) {
  // Fetch the resource from the URL
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }

  // Read the response as a Blob
  const blob = await response.blob();

  // Optional: If you want to ensure the Blob's type, you can recreate the Blob with a specific MIME type
  const typedBlob = new Blob([blob], { type: mimeType });

  // Create and return a URL for the Blob
  return URL.createObjectURL(typedBlob);
}

const ffmpeg = new FFmpeg()

export async function convertWebmToMp3(webmBlob: Blob, fileName: string): Promise<Blob> {
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
  const coreURL = await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript');
  const wasmURL = await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm');
  await ffmpeg.load({
    coreURL,
    wasmURL,
  });

  const inputName = `${fileName}.webm`;
  const outputName = `${fileName}.mp3`

  const inputData = await webmBlob.arrayBuffer().then((buffer) => new Uint8Array(buffer));

  ffmpeg.writeFile(inputName, inputData);

  await ffmpeg.exec(["-i", inputName, outputName]);

  const outputData = await ffmpeg.readFile(outputName);
  const outputBlob = new Blob([outputData], { type: 'audio/mp3' });

  return outputBlob;
}