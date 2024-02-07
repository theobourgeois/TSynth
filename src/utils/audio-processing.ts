import { SynthStore } from "./synth-utils";

export const audioContext = new AudioContext();

// this node takes care of all the audio processing
// this includes both oscillators and effects
export let audioProcessingNode: AudioWorkletNode;

export async function startAudioWorklets() {
  await audioContext.audioWorklet.addModule("src/worklets/audio-processor.js");
  if (audioProcessingNode) {
    stopAudioProcessor()
  }

  audioProcessingNode = new AudioWorkletNode(
    audioContext,
    "audio-processor",
  );
  startAudioProcessor()
}

export function startAudioProcessor() {
  audioProcessingNode.connect(audioContext.destination);
}

export function stopAudioProcessor() {
  audioProcessingNode.disconnect();
}

/**
 * play a note 
 * @param frequency 
 */
export function play(frequency: number) {
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  audioProcessingNode?.parameters?.get("frequency")?.setValueAtTime(frequency, audioContext.currentTime);
  audioProcessingNode?.parameters?.get("playing")?.linearRampToValueAtTime(1, audioContext.currentTime);
}

/**
 * stop playing a note
 * sets the frequency to 0 to stop the note
 */
export function stop() {
  audioProcessingNode?.parameters?.get("playing")?.linearRampToValueAtTime(0, audioContext.currentTime);
}

/**
 * send new data to the audio processor 
 * called whenever the synth settings are updated
 * @param data 
 */
export function setProcessorData(data: SynthStore) {
  audioProcessingNode.port.postMessage(data);
}

export class AudioProcessor {
  audioProcessingNode: AudioWorkletNode | undefined;


  setProcessorData(data: SynthStore) {
    audioProcessingNode.port.postMessage(data);
  }

  startAudioProcessor() {
    audioProcessingNode.connect(audioContext.destination);
  }

  stopAudioProcessor() {
    audioProcessingNode.disconnect();
  }

  play(frequency: number) {
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }
    audioProcessingNode?.parameters?.get("frequency")?.setValueAtTime(frequency, audioContext.currentTime);
    audioProcessingNode?.parameters?.get("playing")?.linearRampToValueAtTime(1, audioContext.currentTime);
  }

  stop() {
    audioProcessingNode?.parameters?.get("playing")?.linearRampToValueAtTime(0, audioContext.currentTime);
  }

  async startAudioWorklets() {
    await audioContext.audioWorklet.addModule("src/worklets/audio-processor.js");
    if (audioProcessingNode) {
      stopAudioProcessor()
    }
    audioProcessingNode = new AudioWorkletNode(
      audioContext,
      "audio-processor",
    );
    this.startAudioProcessor()
  }

}



