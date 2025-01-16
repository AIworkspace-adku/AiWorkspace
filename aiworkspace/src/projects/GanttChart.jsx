import React, { Component } from 'react';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import './GanttChart.css';
import Toolbar from './Toolbar';

const data = {
  data: [
    { id: 1, text: 'Task #1', start_date: '2019-04-15', duration: 3, progress: 0.6 },
    { id: 2, text: 'Task #2', start_date: '2019-04-18', duration: 3, progress: 0.4 }
  ],
  links: [
    { id: 1, source: 1, target: 2, type: '0' }
  ]
};

export default class GanttChart extends Component {
  state = {
    currentZoom: 'Days'
  };

  handleZoomChange = (zoomLevel) => {
    this.setState({ currentZoom: zoomLevel });
    this.updateZoom(zoomLevel);
  };

  updateZoom = (zoomLevel) => {
    const scales = {
      Hours: {
        scale_unit: 'hour',
        subscales: [{ unit: 'minute', step: 30, date: '%H:%i' }],
      },
      Days: {
        scale_unit: 'day',
        subscales: [{ unit: 'hour', step: 1, date: '%H:%i' }],
      },
      Months: {
        scale_unit: 'month',
        subscales: [{ unit: 'week', step: 1, date: '%W' }],
      },
    };

    const currentScale = scales[zoomLevel];
    gantt.config.scale_unit = currentScale.scale_unit;
    gantt.config.subscales = currentScale.subscales;
    gantt.render();
  };

  componentDidMount() {
    gantt.config.date_format = "%Y-%m-%d %H:%i";
    gantt.init(this.ganttContainer);
    gantt.parse(data);
    this.updateZoom(this.state.currentZoom);
  }

  render() {
    return (
      <div>
        <div className="zoom-bar">
          <Toolbar zoom={this.state.currentZoom} onZoomChange={this.handleZoomChange} />
        </div>
        <div
          ref={(input) => { this.ganttContainer = input; }}
          style={{ width: '100%', height: '500px' }}
        ></div>
      </div>
    );
  }
}
