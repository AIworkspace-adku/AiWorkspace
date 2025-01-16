import React, { Component } from 'react';

export default class Toolbar extends Component {
  handleZoomChange = (e) => {
    const zoomLevel = e.target.value;
    if (this.props.onZoomChange) {
      this.props.onZoomChange(zoomLevel);  // Pass zoom level to parent component
    }
  };

  render() {
    const zoomRadios = ['Hours', 'Days', 'Months'].map((value) => {
      const isActive = this.props.zoom === value;
      return (
        <label key={value} className={`radio-label ${isActive ? 'radio-label-active' : ''}`}>
          <input
            type="radio"
            checked={isActive}
            onChange={this.handleZoomChange}
            value={value}
          />
          {value}
        </label>
      );
    });

    return (
      <div className="tool-bar">
        <b>Zooming: </b>
        {zoomRadios}
      </div>
    );
  }
}
