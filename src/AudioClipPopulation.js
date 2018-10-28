import { range, sample, randomInRange } from "./util";
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
      votes: 0,
      notes: this.generateNewClip()
    }));
  }

  // TODO rename this - name is misleading
  generateNewClip() {
    throw new Error("not implemented");
  }

  getClipById(id) {
    // TODO probably should store by id somewhere?
    return this.clips.find(clip => clip.id === id);
  }

  getClipsForStep(step) {
    return this.clips.filter(clip => clip.step === step);
  }

  markClipSelected(id) {
    // TODO don't mutate? but splicing out of an array without mutation is a pain.
    const clip = this.getClipById(id);
    ++clip.votes;
  }

  getBestClips() {
    return this.clips.filter(({ votes }) => votes > 0);
  }

  getBestClipsSorted() {
    return this.getBestClips().sort(
      (a, b) => (a.votes > b.votes ? -1 : b.votes > a.votes ? 1 : 0)
    );
  }
}

export class RandomAudioClipPopulation extends AudioClipPopulation {
  generateNewClip() {
    return getRandomFrequencies(3);
  }
}

export class LolAudioClipPopulation extends AudioClipPopulation {
  generateNewClip() {
    // Randomize the first few.
    if (this.clips.length < 10) return getRandomFrequencies(3);

    // Then once there's a decent initial population, take a random "good" candidate
    // from the existing population and randomly tweak one of the notes.
    const clip = sample(this.getBestClips());
    const randomNoteIndex = sample(range(0, clip.notes.length));
    const mutatedNotes = [...clip.notes];
    mutatedNotes[randomNoteIndex] =
      clip.notes[randomNoteIndex] + randomInRange(5, 500);
    console.debug("mutating existing clip", {
      existingClip: clip,
      mutatedNotes
    });
    return mutatedNotes;
  }
}
