import { SynthStore } from "./synth-utils";

export class AudioProcessor {

  audioContext: AudioContext;
  audioProcessingNode: AudioWorkletNode | undefined;

  constructor() {
    this.audioContext = new AudioContext();
  }

  async setProcessorData(data: SynthStore) {
    if (!this.audioProcessingNode) {
      await this.startAudioWorklets();
    }
    this.audioProcessingNode?.port.postMessage(data);
  }

  startAudioProcessor() {
    this.audioProcessingNode?.connect(this.audioContext.destination);
  }

  stopAudioProcessor() {
    if (!this.audioProcessingNode) {
      return
    }
    this.audioProcessingNode?.disconnect();
  }

  play(frequency: number) {
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }
    this.audioProcessingNode?.parameters?.get("frequency")?.setValueAtTime(frequency, this.audioContext.currentTime);
    this.audioProcessingNode?.parameters?.get("playing")?.linearRampToValueAtTime(1, this.audioContext.currentTime);
  }

  stop() {
    this.audioProcessingNode?.parameters?.get("playing")?.linearRampToValueAtTime(0, this.audioContext.currentTime);
  }

  async startAudioWorklets() {
    await this.audioContext.audioWorklet.addModule("src/worklets/audio-processor.js");
    if (this.audioProcessingNode) {
      this.stopAudioProcessor()
    }
    this.audioProcessingNode = new AudioWorkletNode(
      this.audioContext,
      "audio-processor",
    );
    this.startAudioProcessor()
  }
}

export const audioProcessor = new AudioProcessor();
