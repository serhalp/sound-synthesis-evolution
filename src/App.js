import "./App.css";

import React, { Component } from "react";

import { getRandomFrequencies, playFrequencies } from "./audio";

class App extends Component {
  constructor() {
    super();
    this.state = {
      started: false,
      step: null,
      clips: []
    };
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h2>Sound Synthesis Evolution</h2>
          <p>
            Listen to randomly generated audio clips and select which sounds
            best. Sounds evolve over time using an evolutionary algorithm.
          </p>
        </header>
        {this.state.started ? (
          <section className="App-container">
            <Leaderboard
              clips={this.state.clips.filter(({ selected }) => selected)}
              handlePlayAudioClip={this.handlePlayAudioClip.bind(this)}
            />
            <EvolutionStep
              step={this.state.step}
              clips={this.state.clips.filter(
                ({ step }) => step === this.state.step
              )}
              handlePlayAudioClip={this.handlePlayAudioClip.bind(this)}
              handleSelectAudioClip={this.handleSelectAudioClip.bind(this)}
            />
          </section>
        ) : (
          <Intro handleStart={this.handleStart.bind(this)} />
        )}
      </div>
    );
  }

  handleStart() {
    this.setState({
      started: true,
      step: 0,
      clips: [...this.generateClipsForStep(0)]
    });
  }

  handlePlayAudioClip(id) {
    const { notes } = this.state.clips.find(clip => clip.id === id);
    playFrequencies(notes);
  }

  handleSelectAudioClip(id) {
    // TODO probably should store by id somewhere
    const clip = this.state.clips.find(clip => clip.id === id);
    // TODO don't mutate? but splicing out of an array without mutation is a pain.
    clip.selected = true;
    this.setState({
      step: this.state.step + 1,
      clips: [
        ...this.state.clips,
        ...this.generateClipsForStep(this.state.step + 1)
      ]
    });
  }

  generateClipsForStep(step) {
    return ["A", "B"].map(clipSequenceId => ({
      id: `${step}${clipSequenceId}`,
      label: `${step}${clipSequenceId}`,
      step,
      selected: false,
      notes: getRandomFrequencies(3)
    }));
  }
}

export default App;

const Intro = ({ handleStart }) => (
  <button className="button start-button" onClick={handleStart}>
    Start
  </button>
);

const EvolutionStep = ({
  step,
  clips,
  handlePlayAudioClip,
  handleSelectAudioClip
}) => (
  <div className="EvolutionStep">
    <h3>Step {step}</h3>
    <div className="EvolutionStep-AudioClipContainer">
      {clips.map(clip => (
        <AudioClip
          key={clip.id}
          label={clip.label}
          handlePlay={() => handlePlayAudioClip(clip.id)}
          handleSelect={() => handleSelectAudioClip(clip.id)}
        />
      ))}
    </div>
  </div>
);

const AudioClip = ({ label, handlePlay, handleSelect }) => (
  <div className="AudioClip">
    <button className="button" onClick={handlePlay}>
      Play {label}
    </button>
    {handleSelect != null ? (
      <button className="button select-button" onClick={handleSelect}>
        Sounds better!
      </button>
    ) : null}
  </div>
);

const Leaderboard = ({ clips, handlePlayAudioClip }) => (
  <div className="Leaderboard">
    <h3>Best Clips</h3>
    <div className="Leaderboard-AudioClipContainer">
      {clips.map(clip => (
        <AudioClip
          key={clip.id}
          label={clip.label}
          handlePlay={() => handlePlayAudioClip(clip.id)}
        />
      ))}
    </div>
  </div>
);
