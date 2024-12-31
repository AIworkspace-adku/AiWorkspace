import React, { useEffect, useRef } from "react";
import gantt from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import "./GanttChart.css"; // Custom CSS for styling

const GanttChart = () => {
  const ganttContainer = useRef(null);

  useEffect(() => {
    // Configure Gantt Chart
    gantt.config.scale_unit = "day";
    gantt.config.date_scale = "%d %M %Y";
    gantt.config.step = 1;
    gantt.config.subscales = [{ unit: "hour", step: 1, date: "%H:%i" }];
    gantt.config.drag_progress = true;
    gantt.config.drag_resize = true;
    gantt.config.drag_links = true;
    gantt.config.drag_mode = {
      resize: gantt.config.drag_mode.resize,
      move: gantt.config.drag_mode.move,
      progress: gantt.config.drag_mode.progress,
    };
    gantt.config.columns = [
      { name: "text", label: "Task Name", width: 200, tree: true },
      { name: "start_date", label: "Start Date", align: "center" },
      { name: "duration", label: "Duration (Days)", align: "center" },
      { name: "add", label: "", width: 44 },
    ];

    gantt.templates.progress_text = (start, end, task) =>
      `${Math.round(task.progress * 100)}%`;

    // Dark theme styling
    gantt.templates.grid_row_class = () => "gantt_grid_row";
    gantt.templates.task_row_class = () => "gantt_task_row";
    gantt.templates.task_class = () => "gantt_task";

    gantt.init(ganttContainer.current);

    // Dummy Data
    gantt.parse({
      data: [
        {
          id: 1,
          text: "Design Phase",
          start_date: "2024-01-01",
          duration: 5,
          progress: 0.4,
        },
        {
          id: 2,
          text: "Development",
          start_date: "2024-01-06",
          duration: 10,
          progress: 0.2,
          parent: 1,
        },
        {
          id: 3,
          text: "Testing",
          start_date: "2024-01-17",
          duration: 4,
          progress: 0.6,
          parent: 2,
        },
        {
          id: 4,
          text: "Deployment",
          start_date: "2024-01-22",
          duration: 2,
          progress: 0.8,
        },
      ],
    });

    return () => {
      gantt.clearAll();
    };
  }, []);

  return <div ref={ganttContainer} style={{ width: "100%", height: "600px" }} />;
};

export default GanttChart;
