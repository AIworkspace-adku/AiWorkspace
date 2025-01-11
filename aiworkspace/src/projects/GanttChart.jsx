// import React, { useState } from 'react';
// import Timeline from 'react-gantt-timeline';
// import { TimelineHeaders, DateHeader } from 'react-gantt-timeline';
// import './GanttChart.css';

// const initialTasks = [
//   {
//     id: 1,
//     name: 'Design UI',
//     start: new Date('2025-01-01'),
//     end: new Date('2025-01-05'),
//     progress: 30,
//     members: ['Ayush', 'Krithik'],
//   },
//   {
//     id: 2,
//     name: 'Develop Backend',
//     start: new Date('2025-01-06'),
//     end: new Date('2025-01-12'),
//     progress: 50,
//     members: ['Unnati'],
//   },
//   {
//     id: 3,
//     name: 'Testing',
//     start: new Date('2025-01-13'),
//     end: new Date('2025-01-18'),
//     progress: 80,
//     members: ['Ayush'],
//   },
// ];

// const GanttChart = () => {
//   const [tasks, setTasks] = useState(initialTasks);

//   const handleTaskChange = (updatedTask) => {
//     setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
//   };

//   const handleTaskDelete = (taskId) => {
//     setTasks(tasks.filter((task) => task.id !== taskId));
//   };

//   const addTask = () => {
//     const newTask = {
//       id: Date.now(),
//       name: 'New Task',
//       start: new Date(),
//       end: new Date(new Date().setDate(new Date().getDate() + 3)),
//       progress: 0,
//       members: [],
//     };
//     setTasks([...tasks, newTask]);
//   };

//   return (
//     <div className="gantt-chart-container">
//       <header className="gantt-header">
//         <h2>Project Gantt Chart</h2>
//         <div className="view-options">
//           <button className="view-btn">Weekly</button>
//           <button className="view-btn">Monthly</button>
//           <button onClick={addTask} className="add-task-btn">+ Add Task</button>
//         </div>
//       </header>
//       <Timeline
//         data={tasks.map((task) => ({
//           ...task,
//           name: (
//             <div className="task-name-with-avatars">
//               <span>{task.name}</span>
//               <div className="avatars">
//                 {task.members.map((member, index) => (
//                   <div key={index} className="avatar" title={member}>
//                     {member.split(' ').map((n) => n[0]).join('')}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ),
//         }))}
//         onUpdateTask={handleTaskChange}
//         headers={<TimelineHeaders><DateHeader unit="day" /></TimelineHeaders>}
//         onDeleteTask={handleTaskDelete}
//         disableDrag={false}
//         disableResize={false}
//         rowHeight={60}
//       />
//     </div>
//   );
// };

// export default GanttChart;
