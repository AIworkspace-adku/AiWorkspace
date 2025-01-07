import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import "./TaskTracker.css";

const TaskTracker = (projId) => {
    const projectId = projId.projId;
    const [modules, setModules] = useState([]);

    const [teamMembers, setTeamMembers] = useState([]);
    const [newModule, setNewModule] = useState("");
    const [assignedTo, setAssignedTo] = useState([]);
    const [showAddModule, setShowAddModule] = useState(false);
    const [showAddTask, setShowAddTask] = useState(null);
    const [showUpdateModule, setShowUpdateModule] = useState(null);
    const [showUpdateTask, setShowUpdateTask] = useState(null);
    const [newTask, setNewTask] = useState("");
    const [taskAssignedTo, setTaskAssignedTo] = useState([]);

    useEffect(() => {
        fetchMembers();
        fetchModules();
    }, [projectId]);

    const fetchMembers = async () => {
        try {
            const response = await axios.post("http://localhost:5000/fetchMembersUsingProjId", {
                projId: projectId,
            })

            if (response.data.members) {
                setTeamMembers(response.data.members);
            }
            else {
                console.log("No members found");
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const fetchModules = async () => {
        try {
            const response = await axios.post("http://localhost:5000/fetchModules", {
                projId: projectId,
            })

            if (response.data.modules) {
                setModules(response.data.modules);
            }
            else {
                console.log("No members found");
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    if (!teamMembers) {
        return <div>Loading...</div>;
    }

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

    const handleAddModule = async () => {
        if (!newModule.trim()) return;
        try {
            const response = await axios.post("http://localhost:5000/addModule", {
                projId: projectId,
                moduleName: newModule,
                assignedTo: assignedTo,
            })

            if (response.data.modules) {
                setModules(...modules, response.data.modules);
                setNewModule("");
                setAssignedTo([]);
                setShowAddModule(false);
            }
            else {
                console.log("No modules found");
            }
        }
        catch (error) {
            console.log(error);
        }
    };

    const handleAddTask = async (moduleId) => {
        if (!newTask.trim()) return;

        try {
            const response = await axios.post("http://localhost:5000/addTask", {
                moduleId: moduleId,
                projId: projectId,
                taskName: newTask,
                assignedTo: taskAssignedTo,
            })

            if (response.data.savedTask) {
                setModules(
                    modules.map((module) =>
                        module._id === moduleId
                            ? {
                                ...module,
                                tasks: [
                                    ...module.tasks, 
                                    response.data.savedTask
                                ],
                            }
                            : module
                    )
                );
                setNewTask("");
                setTaskAssignedTo([]);
                setShowAddTask(null);
            }
            else {
                console.log("No modules found");
            }
        }
        catch (error) {
            console.log(error);
        }
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
                        onChange={(e) => setNewModule(e.target.value)}
                        className="input-field"
                    />
                    <div className="member-checkbox-list">
                        {teamMembers.map((member) => (
                            <label key={member.username} className="checkbox-label">
                                <input
                                    type="checkbox"
                                    value={member.username}
                                    checked={assignedTo.includes(member)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setAssignedTo([...assignedTo, member]);
                                        } else {
                                            setAssignedTo(prevAssignedTo => prevAssignedTo.filter(m => m.email !== member.email));
                                        }
                                    }}
                                />
                                {member.username}
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
                {modules && modules.map((module) => (
                    <div key={module._id} className="module-task-wrapper">
                        <div className="module-card">
                            <span
                                className="status-bullet"
                                style={{ backgroundColor: getBulletColor(module.tasks) }}
                            ></span>
                            <div className="module-header">
                                <h3>{module.moduleName}</h3>
                                <div className="avatars">
                                    {module.assignedTo.map((member, index) => (
                                        <div key={index} className="avatar" title={member}>
                                            {member.username
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
                                onClick={() => setShowUpdateModule(module._id)}
                            >
                                <FaEdit />
                            </button>
                            <button
                                className="delete-module-button"
                                onClick={() => setModules(modules.filter((m) => m._id !== module._id))}
                            >
                                <FaTrash />
                            </button>
                        </div>

                        <div className="task-card">
                            {module.tasks.map((task) => (
                                <div key={task._id} className="task-item">
                                    <input
                                        type="checkbox"
                                        checked={task.status === 1}
                                        onChange={() =>
                                            setModules(
                                                modules.map((m) =>
                                                    m._id === module._id
                                                        ? {
                                                            ...m,
                                                            tasks: m.tasks.map((t) =>
                                                                t._id === task._id ? { ...t, status: !t.status } : t
                                                            ),
                                                        }
                                                        : m
                                                )
                                            )
                                        }
                                    />
                                    <span>{task.taskName}</span>
                                    <div className="avatars">
                                        {task.assignedTo.map((member, index) => (
                                            <div key={index} className="avatar" title={member.username}>
                                                {member.username
                                                    .split(" ")
                                                    .map((name) => name[0])
                                                    .join("")}
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        className="update-task-button"
                                        onClick={() => setShowUpdateTask({ moduleId: module._id, task })}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        className="action-button"
                                        onClick={() =>
                                            setModules(
                                                modules.map((m) =>
                                                    m._id === module._id
                                                        ? {
                                                            ...m,
                                                            tasks: m.tasks.filter((t) => t.taskId !== task.taskId),
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
                                onClick={() => setShowAddTask(module._id)}
                            >
                                <FaPlus /> Add Task
                            </button>

                            {/* Add Task Form */}
                            {showAddTask === module._id && (
                                <div className="floating-form">
                                    <input
                                        type="text"
                                        placeholder="Task Name"
                                        value={newTask}
                                        onChange={(e) => setNewTask(e.target.value)}
                                        className="input-field"
                                    />
                                    <div className="member-checkbox-list">
                                        {module.assignedTo.map((member) => (
                                            <label key={member.username} className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    value={member.username}
                                                    checked={taskAssignedTo.includes(member)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setTaskAssignedTo([...taskAssignedTo, member]);
                                                        } else {
                                                            setTaskAssignedTo(prevAssignedTo => prevAssignedTo.filter(m => m.email !== member.email));
                                                        }
                                                    }}
                                                />
                                                {member.username}
                                            </label>
                                        ))}
                                    </div>
                                    <button className="save-button" onClick={() => handleAddTask(module._id)}>
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
                                        <label key={member.username} className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                value={member.username}
                                                checked={newModule.assignedTo.includes(member.username)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setNewModule({
                                                            ...newModule,
                                                            assignedTo: [...newModule.assignedTo, member.username],
                                                        });
                                                    } else {
                                                        setNewModule({
                                                            ...newModule,
                                                            assignedTo: newModule.assignedTo.filter((m) => m !== member.username),
                                                        });
                                                    }
                                                }}
                                            />
                                            {member.username}
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
                                        <label key={member.username} className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                value={member.username}
                                                checked={newTask.assignedTo.includes(member.username) || showUpdateTask.task.assignedTo.includes(member.username)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setNewTask({
                                                            ...newTask,
                                                            assignedTo: [...newTask.assignedTo, member.username],
                                                        });
                                                    } else {
                                                        setNewTask({
                                                            ...newTask,
                                                            assignedTo: newTask.assignedTo.filter((m) => m !== member.username),
                                                        });
                                                    }
                                                }}
                                            />
                                            {member.username}
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
