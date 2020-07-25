import React, { Component } from "react";
import Graph from "./Graph";
import { makePoints, stepsToPi } from "./pi";

class App extends Component {
  constructor(props) {
    super(props);

    const initialPoints = 100;
    this.state = {
      pointsCount: initialPoints,
      points: makePoints(initialPoints)
    };
  }

  handleChange(e) {
    const pointsCount = e.target.value;
    this.setState({ pointsCount, points: makePoints(pointsCount) });
  }

  render() {
    const points = this.state.points;
    const steps = stepsToPi(points).map(text => <li key={text}>{text}</li>);

    return (
      <div style={{ paddingTop: 10, paddingLeft: 10 }}>
        <div
          style={{
            display: "inline-block",
            maxWidth: "50%"
          }}
        >
          <Graph points={points} size={500} />
        </div>
        <div
          style={{
            textAlign: "left",
            verticalAlign: "top",
            padding: 20,
            display: "inline-block",
            maxWidth: "50%"
          }}
        >
          <button
            onClick={() =>
              this.setState({ points: makePoints(this.state.pointsCount) })
            }
          >
            Reload
          </button>
          <input
            type="number"
            value={this.state.pointsCount}
            onChange={e => this.handleChange(e)}
          />
          <ol>{steps}</ol>
        </div>
      </div>
    );
  }
}

export default App;
