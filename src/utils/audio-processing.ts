import { SynthState } from "./synth-utils";

export class AudioProcessor {

  audioContext: AudioContext;
  audioProcessingNode: AudioWorkletNode | undefined;

  constructor() {
    this.audioContext = new AudioContext();
  }

  async setProcessorData(data: Omit<SynthState, 'LFO'>) {
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
    this.audioProcessingNode?.parameters?.get("playing")?.setValueAtTime(1, this.audioContext.currentTime);
    this.audioProcessingNode?.port.postMessage({ addFrequency: frequency });
  }

  stop(freq?: number) {
    //this.audioProcessingNode?.parameters?.get("playing")?.setValueAtTime(0, this.audioContext.currentTime);
    if (freq) {
      this.audioProcessingNode?.port.postMessage({ removeFrequency: freq });
    }
  }

  async startAudioWorklets() {
    await this.audioContext.audioWorklet.addModule("src/worklets/audio-processor.js");
    if (this.audioProcessingNode) {
      this.stopAudioProcessor()
    }
    this.audioProcessingNode = new AudioWorkletNode(
      this.audioContext,
      "audio-processor",
      {
        numberOfOutputs: 1,
        outputChannelCount: [2],
      }
    );
    this.startAudioProcessor()
  }
}

export const audioProcessor = new AudioProcessor();
