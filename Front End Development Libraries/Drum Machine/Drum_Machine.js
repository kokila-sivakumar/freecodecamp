class DrumMachine extends React.Component {
    constructor(props) {
      super(props);
  
      const padData = [
        { key: "Q", soundName: "H-1", soundFile: "Heater-1.mp3" },
        { key: "W", soundName: "H-2", soundFile: "Heater-2.mp3" },
        { key: "E", soundName: "H-3", soundFile: "Heater-3.mp3" },
        { key: "A", soundName: "H-4", soundFile: "Heater-4_1.mp3" },
        { key: "S", soundName: "Clap", soundFile: "Heater-6.mp3" },
        { key: "D", soundName: "Open-HH", soundFile: "Dsc_Oh.mp3" },
        { key: "Z", soundName: "Kick-n'-Hat", soundFile: "Kick_n_Hat.mp3" },
        { key: "X", soundName: "Kick", soundFile: "RP4_KICK_1.mp3" },
        { key: "C", soundName: "Closed-HH", soundFile: "Cev_H2.mp3" }
      ];
  
      const soundUrlPrefix = "https://s3.amazonaws.com/freecodecamp/drums/";
  
      this.state = {
        padData: padData,
        soundUrlPrefix: soundUrlPrefix,
        displayText: "ReactPad!"
      };
  
      this.handlePadClick = this.handlePadClick.bind(this);
      this.handleKeys = this.handleKeys.bind(this);
      this.playPad = this.playPad.bind(this);
    }
  
    componentDidMount() {
      document.addEventListener("keydown", this.handleKeys);
    }
    componentWillUnmount() {
      document.removeEventListener("keydown", this.handleKeys);
    }
  
    handleKeys(event) {
      const keyArray = this.state.padData;
      keyArray.forEach((k) => {
        event.keyCode == k.key.charCodeAt(0) ? this.playPad(k.key) : "";
      });
    }
  
    handlePadClick(padKey, event) {
      this.playPad(padKey);
    }
  
    playPad(padKey) {
      const audio = document.getElementById(padKey);
      const padDisplay = this.state.padData.find((i) => i.key == padKey)
        .soundName;
      audio.currentTime = 0;
      audio.play();
      this.setState((state) => {
        return {
          padData: this.state.padData,
          soundUrlPrefix: this.state.soundUrlPrefix,
          displayText: padDisplay
        };
      });
    }
  
    render() {
      const pads = this.state.padData.map((item) => (
        <DrumPad
          hotKey={item.key}
          soundFile={this.state.soundUrlPrefix + item.soundFile}
          soundName={item.soundName}
          clickHandler={this.handlePadClick}
        />
      ));
      return (
        <div id="wrapper">
          <div id="drum-wrapper">
            <div id="drum-machine">
              <DrumDisplay displayText={this.state.displayText} />
              <div id="drum-pad-wrapper">{pads}</div>
            </div>
          </div>
        </div>
      );
    }
  }
  
  class DrumPad extends React.Component {
    constructor(props) {
      super(props);
    }
  
    render() {
      return (
        <div
          id={this.props.soundName}
          key={this.props.hotKey}
          onClick={(e) => this.props.clickHandler(this.props.hotKey, e)}
          className="drum-pad"
        >
          <div className="drum-pad-label">
            <span>{this.props.hotKey}</span>
            <audio
              id={this.props.hotKey}
              className="clip"
              src={this.props.soundFile}
            ></audio>
          </div>
        </div>
      );
    }
  }
  
  class DrumDisplay extends React.Component {
    constructor(props) {
      super(props);
    }
  
    render() {
      return (
        <div id="display">
          <div id="display-text">{this.props.displayText}</div>
        </div>
      );
    }
  }
  
  ReactDOM.render(<DrumMachine />, document.getElementById("app"));