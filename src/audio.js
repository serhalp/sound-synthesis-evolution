import { times, randomInRange, delay } from "./util";

function initialize() {
  if (context != null) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (AudioContext == null)
    throw new Error("Web Audio API not supported by this browser");
  context = new AudioContext();
}

export function playFrequency(frequency) {
  initialize();

  // Initial configuration
  const envelope = context.createGain();
  envelope.connect(context.destination);
  const oscillator = context.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, context.currentTime);
  oscillator.connect(envelope);

  // Start at zero volume
  envelope.gain.setValueAtTime(0, context.currentTime);
  // Fade in
  envelope.gain.setTargetAtTime(volume, context.currentTime, attack / 1000);
  // Fade out
  envelope.gain.setTargetAtTime(
    0,
    context.currentTime + attack / 1000,
    release / 1000
  );

  // Stop after a while
  setTimeout(() => {
    oscillator.stop();
    oscillator.disconnect(envelope);
    envelope.gain.cancelScheduledValues(context.currentTime);
    envelope.disconnect(context.destination);
  }, attack * 10 + release * 10);

  // Fire it all off
  oscillator.start();
}

export async function playFrequencies(frequencies) {
  for (const frequency of frequencies) {
    playFrequency(frequency);
    await delay(release * 5);
  }
}

export function getRandomFrequency(min = MIN_FREQUENCY, max = MAX_FREQUENCY) {
  return randomInRange(min, max);
}

export function getRandomFrequencies(num, min, max) {
  return times(num, () => getRandomFrequency(min, max));
}

let context = null;
const volume = 1;
const attack = 1;
const release = 100;

const MIN_FREQUENCY = 16; // ~16 Hz is lowest humans can generally hear
const MAX_FREQUENCY = 16000; // ~16000 is highest humans can generally hear
