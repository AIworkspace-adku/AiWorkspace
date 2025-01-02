import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import "./TaskTracker.css";

const TaskTracker = () => {
    const [modules, setModules] = useState([
        {
            id: 1,
            title: "Module 1",
            tasks: [
                { id: 101, title: "Complete UI Mockups", assignedTo: ["Ayush Pani"], done: false },
                { id: 102, title: "Fix Navbar Bug", assignedTo: ["Krithik Pats"], done: false },
            ],
            assignedTo: ["Krithik Pats", "Ayush Pani"],
        },
        {
            id: 2,
            title: "Module 2",
            tasks: [],
            assignedTo: ["Disha Poojary"],
        },
    ]);

    const [teamMembers] = useState(["Ayush Pani", "Krithik Pats", "Disha Poojary", "Unnati Pohankar"]);
    const [newModule, setNewModule] = useState({ title: "", assignedTo: [] });
    const [showAddModule, setShowAddModule] = useState(false);
    const [showAddTask, setShowAddTask] = useState(null);
    const [showUpdateModule, setShowUpdateModule] = useState(null);
    const [showUpdateTask, setShowUpdateTask] = useState(null);
    const [newTask, setNewTask] = useState({ title: "", assignedTo: [] });

    const getProgress = (tasks) => {
        if (!tasks || tasks.length === 0) return 0;
        const completed = tasks.filter((task) => task.done).length;
        return Math.round((completed / tasks.length) * 100);
    };

    const getBulletColor = (tasks) => {
        const progress = getProgress(tasks);
        if (progress === 0) return "red";
        if (progress > 0 && progress < 100) return "yellow";
        return "green";
    };

    const handleAddModule = () => {
        if (!newModule.title.trim()) return;
        setModules([
            ...modules,
            {
                id: Date.now(),
                title: newModule.title,
                tasks: [],
                assignedTo: newModule.assignedTo,
            },
        ]);
        setNewModule({ title: "", assignedTo: [] });
        setShowAddModule(false);
    };

    const handleAddTask = (moduleId) => {
        if (!newTask.title.trim()) return;
        setModules(
            modules.map((module) =>
                module.id === moduleId
                    ? {
                        ...module,
                        tasks: [
                            ...module.tasks,
                            { id: Date.now(), title: newTask.title, assignedTo: newTask.assignedTo, done: false },
                        ],
                    }
                    : module
            )
        );
        setNewTask({ title: "", assignedTo: [] });
        setShowAddTask(null);
    };

    const handleUpdateModule = (moduleId) => {
        setModules(
            modules.map((module) =>
                module.id === moduleId
                    ? { ...module, title: newModule.title, assignedTo: newModule.assignedTo }
                    : module
            )
        );
        setShowUpdateModule(null);
    };

    const handleUpdateTask = (moduleId, taskId) => {
        setModules(
            modules.map((module) =>
                module.id === moduleId
                    ? {
                        ...module,
                        tasks: module.tasks.map((task) =>
                            task.id === taskId
                                ? { ...task, title: newTask.title, assignedTo: newTask.assignedTo }
                                : task
                        ),
                    }
                    : module
            )
        );
        setShowUpdateTask(null);
    };

    return (
        <div className="task-tracker">
            <button className="add-module-button" onClick={() => setShowAddModule(true)}>
                Add Module
            </button>

            {showAddModule && (
                <div className="floating-form">
                    <input
                        type="text"
                        placeholder="Module Name"
                        value={newModule.title}
                        onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                        className="input-field"
                    />
                    <div className="member-checkbox-list">
                        {teamMembers.map((member) => (
                            <label key={member} className="checkbox-label">
                                <input
                                    type="checkbox"
                                    value={member}
                                    checked={newModule.assignedTo.includes(member)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setNewModule({
                                                ...newModule,
                                                assignedTo: [...newModule.assignedTo, member],
                                            });
                                        } else {
                                            setNewModule({
                                                ...newModule,
                                                assignedTo: newModule.assignedTo.filter((m) => m !== member),
                                            });
                                        }
                                    }}
                                />
                                {member}
                            </label>
                        ))}
                    </div>
                    <button className="save-button" onClick={handleAddModule}>
                        Save
                    </button>
                    <button className="cancel-button" onClick={() => setShowAddModule(false)}>
                        Cancel
                    </button>
                </div>
            )}

            <div className="module-task-container">
                {modules.map((module) => (
                    <div key={module.id} className="module-task-wrapper">
                        <div className="module-card">
                            <span
                                className="status-bullet"
                                style={{ backgroundColor: getBulletColor(module.tasks) }}
                            ></span>
                            <div className="module-header">
                                <h3>{module.title}</h3>
                                <div className="avatars">
                                    {module.assignedTo.map((member, index) => (
                                        <div key={index} className="avatar" title={member}>
                                            {member
                                                .split(" ")
                                                .map((name) => name[0])
                                                .join("")}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{
                                        width: `${getProgress(module.tasks)}%`,
                                    }}
                                ></div>
                            </div>
                            <button
                                className="update-module-button"
                                onClick={() => setShowUpdateModule(module.id)}
                            >
                                <FaEdit />
                            </button>
                            <button
                                className="delete-module-button"
                                onClick={() => setModules(modules.filter((m) => m.id !== module.id))}
                            >
                                <FaTrash />
                            </button>
                        </div>

                        <div className="task-card">
                            {module.tasks.map((task) => (
                                <div key={task.id} className="task-item">
                                    <input
                                        type="checkbox"
                                        checked={task.done}
                                        onChange={() =>
                                            setModules(
                                                modules.map((m) =>
                                                    m.id === module.id
                                                        ? {
                                                            ...m,
                                                            tasks: m.tasks.map((t) =>
                                                                t.id === task.id ? { ...t, done: !t.done } : t
                                                            ),
                                                        }
                                                        : m
                                                )
                                            )
                                        }
                                    />
                                    <span>{task.title}</span>
                                    <div className="avatars">
                                        {task.assignedTo.map((member, index) => (
                                            <div key={index} className="avatar" title={member}>
                                                {member
                                                    .split(" ")
                                                    .map((name) => name[0])
                                                    .join("")}
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        className="update-task-button"
                                        onClick={() => setShowUpdateTask({ moduleId: module.id, task })}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        className="action-button"
                                        onClick={() =>
                                            setModules(
                                                modules.map((m) =>
                                                    m.id === module.id
                                                        ? {
                                                            ...m,
                                                            tasks: m.tasks.filter((t) => t.id !== task.id),
                                                        }
                                                        : m
                                                )
                                            )
                                        }
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}

                            {/* Add Task Button */}
                            <button
                                className="add-task-button"
                                onClick={() => setShowAddTask(module.id)}
                            >
                                <FaPlus /> Add Task
                            </button>

                            {/* Add Task Form */}
                            {showAddTask === module.id && (
                                <div className="floating-form">
                                    <input
                                        type="text"
                                        placeholder="Task Name"
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                        className="input-field"
                                    />
                                    <div className="member-checkbox-list">
                                        {teamMembers.map((member) => (
                                            <label key={member} className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    value={member}
                                                    checked={newTask.assignedTo.includes(member)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setNewTask({
                                                                ...newTask,
                                                                assignedTo: [...newTask.assignedTo, member],
                                                            });
                                                        } else {
                                                            setNewTask({
                                                                ...newTask,
                                                                assignedTo: newTask.assignedTo.filter((m) => m !== member),
                                                            });
                                                        }
                                                    }}
                                                />
                                                {member}
                                            </label>
                                        ))}
                                    </div>
                                    <button className="save-button" onClick={() => handleAddTask(module.id)}>
                                        Save
                                    </button>
                                    <button
                                        className="cancel-button"
                                        onClick={() => setShowAddTask(null)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>

                        {showUpdateModule === module.id && (
                            <div className="floating-form">
                                <input
                                    type="text"
                                    placeholder="Update Module Name"
                                    value={newModule.title}
                                    onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                                    className="input-field"
                                />
                                <div className="member-checkbox-list">
                                    {teamMembers.map((member) => (
                                        <label key={member} className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                value={member}
                                                checked={newModule.assignedTo.includes(member)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setNewModule({
                                                            ...newModule,
                                                            assignedTo: [...newModule.assignedTo, member],
                                                        });
                                                    } else {
                                                        setNewModule({
                                                            ...newModule,
                                                            assignedTo: newModule.assignedTo.filter((m) => m !== member),
                                                        });
                                                    }
                                                }}
                                            />
                                            {member}
                                        </label>
                                    ))}
                                </div>
                                <button
                                    className="save-button"
                                    onClick={() => handleUpdateModule(module.id)}
                                >
                                    Save
                                </button>
                                <button
                                    className="cancel-button"
                                    onClick={() => setShowUpdateModule(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                        {showUpdateTask && showUpdateTask.moduleId === module.id && (
                            <div className="floating-form">
                                <input
                                    type="text"
                                    placeholder="Update Task Name"
                                    value={newTask.title || showUpdateTask.task.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    className="input-field"
                                />
                                <div className="member-checkbox-list">
                                    {teamMembers.map((member) => (
                                        <label key={member} className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                value={member}
                                                checked={newTask.assignedTo.includes(member) || showUpdateTask.task.assignedTo.includes(member)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setNewTask({
                                                            ...newTask,
                                                            assignedTo: [...newTask.assignedTo, member],
                                                        });
                                                    } else {
                                                        setNewTask({
                                                            ...newTask,
                                                            assignedTo: newTask.assignedTo.filter((m) => m !== member),
                                                        });
                                                    }
                                                }}
                                            />
                                            {member}
                                        </label>
                                    ))}
                                </div>
                                <button
                                    className="save-button"
                                    onClick={() => handleUpdateTask(module.id, showUpdateTask.task.id)}
                                >
                                    Save
                                </button>
                                <button
                                    className="cancel-button"
                                    onClick={() => setShowUpdateTask(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}

                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskTracker;
