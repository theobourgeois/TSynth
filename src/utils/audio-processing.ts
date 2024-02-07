export const audioContext = new AudioContext();

// this node takes care of all the audio processing
// this includes both oscillators and effects
export let audioProcessingNode: AudioWorkletNode;
window.onload = startAudioWorklets

export async function startAudioWorklets() {
  await audioContext.audioWorklet.addModule("src/worklets/audio-processor.js");
  audioProcessingNode = new AudioWorkletNode(
    audioContext,
    "audio-processor",
  );
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
  audioProcessingNode?.parameters?.get("frequency")?.setValueAtTime(frequency, audioContext.currentTime);
}

/**
 * stop playing a note
 * sets the frequency to 0 to stop the note
 */
export function stop() {
  audioProcessingNode?.parameters?.get("frequency")?.setValueAtTime(0, audioContext.currentTime);
}

/**
 * send new data to the audio processor 
 * called whenever the synth settings are updated
 * @param data 
 */
export function setProcessorData(data: TODO) {
  audioProcessingNode.port.postMessage(data);
}






