import { getRandomFrequencies } from "./audio";

class AudioClipPopulation {
  constructor() {
    this.clips = [];
    this.addClipsForStep(0);
  }

  addClipsForStep(step) {
    this.clips = [...this.clips, ...this.generateClipsForStep(step)];
  }

  generateClipsForStep(step) {
    return ["A", "B"].map(clipSequenceId => ({
      id: `${step}${clipSequenceId}`,
      label: `${step}${clipSequenceId}`,
      step,
      selected: false,
      notes: this.generateNewClip()
    }));
  }

  generateNewClip() {
    throw new Error("not implemented");
  }

  getClipById(id) {
    // TODO probably should store by id somewhere?
    return this.clips.find(clip => clip.id === id);
  }

  getBestClips() {
    throw new Error("not implemented");
  }

  getClipsForStep(step) {
    return this.clips.filter(clip => clip.step === step);
  }

  markClipSelected(id) {
    // TODO don't mutate? but splicing out of an array without mutation is a pain.
    const clip = this.getClipById(id);
    clip.selected = true;
  }
}

export class RandomAudioClipPopulation extends AudioClipPopulation {
  generateNewClip() {
    return getRandomFrequencies(3);
  }

  getBestClips() {
    return this.clips.filter(({ selected }) => selected);
  }
}
