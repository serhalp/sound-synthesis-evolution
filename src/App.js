import "./App.css";

import React, { Component, Fragment } from "react";

import logo from "./logo.svg";
import { getRandomFrequencies, playFrequencies } from "./audio";

class App extends Component {
  constructor() {
    super();
    this.state = {
      started: false,
      step: null,
      clipsByStep: []
    };
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Sound Synthesis Evolution</h1>
          <p>
            Listen to randomly generated audio clips and select which sounds
            best. Sounds evolve over time using an evolutionary algorithm.
          </p>
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <section>
          {this.state.started ? (
            <EvolutionStep
              step={this.state.step + 1}
              clips={this.state.clipsByStep[this.state.step]}
              handlePlayAudioClip={this.handlePlayAudioClip.bind(this)}
              handleSelectAudioClip={this.handleSelectAudioClip.bind(this)}
            />
          ) : (
            <Intro handleStart={this.handleStart.bind(this)} />
          )}
        </section>
      </div>
    );
  }

  handleStart() {
    this.setState({
      started: true,
      step: 0,
      clipsByStep: [this.generateNextClips()]
    });
  }

  handlePlayAudioClip(id) {
    const { notes } = this.state.clipsByStep[this.state.step].find(
      clip => clip.id === id
    );
    playFrequencies(notes);
  }

  handleSelectAudioClip(id) {
    this.setState({
      step: this.state.step + 1,
      clipsByStep: [...this.state.clipsByStep, this.generateNextClips()]
    });
  }

  generateNextClips() {
    const step = 1 + (this.state.step != null ? this.state.step : 0);
    return ["A", "B"].map(clipSequenceId => ({
      id: `${step}${clipSequenceId}`,
      label: `${step}${clipSequenceId}`,
      notes: getRandomFrequencies(3)
    }));
  }
}

export default App;

const Intro = ({ handleStart }) => (
  <button className="button" onClick={handleStart}>
    Start
  </button>
);

const EvolutionStep = ({
  step,
  clips,
  handlePlayAudioClip,
  handleSelectAudioClip
}) => (
  <Fragment>
    <h2>Step {step}</h2>
    <div className="AudioClipContainer">
      {clips.map(clip => (
        <AudioClip
          key={clip.id}
          label={clip.label}
          handlePlay={() => handlePlayAudioClip(clip.id)}
          handleSelect={() => handleSelectAudioClip(clip.id)}
        />
      ))}
    </div>
  </Fragment>
);

const AudioClip = ({ label, handlePlay, handleSelect }) => (
  <div className="AudioClip">
    <h3>{label}</h3>
    <button className="button" onClick={handlePlay}>
      Play
    </button>
    <button className="button select-button" onClick={handleSelect}>
      Sounds better!
    </button>
  </div>
);
