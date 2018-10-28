import "./App.css";

import React, { Component } from "react";

import { playFrequencies } from "./audio";
import AudioClipPopulation from "./AudioClipPopulation";

class App extends Component {
  constructor() {
    super();
    this.state = {
      started: false,
      step: null,
      audioClipPopulation: null
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
              clips={this.state.audioClipPopulation.getBestClips()}
              handlePlayAudioClip={this.handlePlayAudioClip.bind(this)}
            />
            <EvolutionStep
              step={this.state.step}
              clips={this.state.audioClipPopulation.getClipsForStep(
                this.state.step
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
    this.setState(previousState => {
      return {
        started: true,
        step: 0,
        audioClipPopulation: new AudioClipPopulation()
      };
    });
  }

  handlePlayAudioClip(id) {
    const { notes } = this.state.audioClipPopulation.getClipById(id);
    playFrequencies(notes);
  }

  handleSelectAudioClip(id) {
    this.state.audioClipPopulation.markClipSelected(id);
    this.setState(previousState => {
      previousState.audioClipPopulation.addClipsForStep(previousState.step + 1);
      return {
        step: previousState.step + 1
      };
    });
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
