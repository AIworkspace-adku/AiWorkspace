import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import "./TaskTracker.css";

const TaskTracker = ({ projId, userData }) => {
    const projectId = projId;
    const [modules, setModules] = useState([]);
    const [teamOwner, setTeamOwner] = useState(null);
    const [teamId, setTeamId] = useState("");
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
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/fetchMembersUsingProjId`, {
                projId: projectId,
            })

            if (response.data.members) {
                setTeamId(response.data.teamId);
                setTeamMembers(response.data.members);
                setTeamOwner(response.data.owner);
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
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/fetchModules`, {
                projId: projectId,
            })

            if (response.data.modules) {
                setModules(response.data.modules);
            }
            else {
                console.log("No modules found");
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    if (!teamMembers || !modules || !teamOwner) {
        return <div>Loading...</div>;
    }

    const getProgress = (tasks) => {
        if (!tasks || tasks.length === 0) return 0;
        const completed = tasks.filter((task) => task.status).length;
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
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/addModule`, {
                teamId: teamId,
                projId: projectId,
                moduleName: newModule,
                assignedTo: assignedTo,
            })

            if (response.data.modules) {
                setModules([...modules, response.data.modules]);
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
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/addTask`, {
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

    const handleUpdateModule = async (moduleId) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/updateModule`, {
                moduleId: moduleId,
                moduleName: newModule,
                assignedTo: assignedTo,
            })

            if (response.data.updatedModule) {
                setModules(
                    modules.map((module) =>
                        module._id === moduleId
                            ? response.data.updatedModule
                            : module
                    )
                );
                setNewModule("");
                setAssignedTo([]);
                setShowUpdateModule(null);
            }
            else {
                console.log("No modules found");
            }
        }
        catch (error) {
            console.log(error);
        }
    };

    const handleDeleteModule = async (moduleId) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/deleteModule`, {
                moduleId: moduleId,
            })
            if (response.data.deletedModule) {
                setModules(modules.filter((module) => module._id !== moduleId));
            }
            else {
                console.log("No modules found");
            }
        }
        catch (error) {
            console.log(error);
        }
    };

    const handleUpdateTask = async (moduleId, taskId, status, statusUpdate) => {
        console.log(moduleId);
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/updateTask`, {
                moduleId: moduleId,
                taskId: taskId,
                taskName: newTask,
                assignedTo: taskAssignedTo,
                status: status,
                statusUpdate: statusUpdate,
            })

            if (response.data.updatedTask) {
                setModules(
                    modules.map((module) =>
                        module._id === moduleId
                            ? {
                                ...module,
                                tasks: module.tasks.map((task) =>
                                    task._id === taskId
                                        ? response.data.updatedTask
                                        : task
                                ),
                            }
                            : module
                    )
                );
                setShowUpdateTask(null);
            }
            else {
                console.log("No modules found");
            }
        }
        catch (error) {
            console.log(error);
        }
    };

    const handleRemoveTask = async (moduleId, taskId) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/deleteTask`, {
                moduleId: moduleId,
                taskId: taskId,
            })

            if (response.data.deletedTask) {
                setModules(
                    modules.map((module) =>
                        module._id === moduleId
                            ? {
                                ...module,
                                tasks: module.tasks.filter((task) => task._id !== taskId),
                            }
                            : module
                    )
                );
            }
            else {
                console.log("No modules found");
            }
        }
        catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="task-tracker">
            {teamOwner.email == userData.email && (
                <button className="add-module-button" onClick={() => setShowAddModule(true)}>
                    Add Module
                </button>
            )}

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
                            {teamOwner.email == userData.email && (
                                <button
                                    className="update-module-button"
                                    onClick={() => setShowUpdateModule(module._id)}
                                >
                                    <FaEdit />
                                </button>
                            )}
                            {teamOwner.email == userData.email && (
                                <button
                                    className="delete-module-button"
                                    onClick={() => handleDeleteModule(module._id)}
                                >
                                    <FaTrash />
                                </button>
                            )}
                        </div>

                        <div className="task-card">
                            {module.tasks.map((task) => (
                                <div key={task._id} className="task-item">
                                    <input
                                        type="checkbox"
                                        checked={task.status}
                                        onChange={() => handleUpdateTask(module._id, task._id, !task.status, true)}
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
                                    {teamOwner.email == userData.email && (
                                        <button
                                            className="update-task-button"
                                            onClick={() => setShowUpdateTask({ moduleId: module._id, task })}
                                        >
                                            <FaEdit />
                                        </button>
                                    )}
                                    {teamOwner.email == userData.email && (
                                        <button
                                            className="action-button"
                                            onClick={() => handleRemoveTask(module._id, task._id)}
                                        >
                                            <FaTrash />
                                        </button>
                                    )}
                                </div>
                            ))}

                            {/* Add Task Button */}
                            {teamOwner.email == userData.email && (
                                <button
                                    className="add-task-button"
                                    onClick={() => setShowAddTask(module._id)}
                                >
                                    <FaPlus /> Add Task
                                </button>
                            )}

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

                        {showUpdateModule === module._id && (
                            <div className="floating-form">
                                <input
                                    type="text"
                                    placeholder="Update Module Name"
                                    value={newModule || module.moduleName}
                                    onChange={(e) => setNewModule(e.target.value)}
                                    className="input-field"
                                />
                                <div className="member-checkbox-list">
                                    {teamMembers.map((member) => (
                                        <label key={member.username} className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                value={member.username}
                                                checked={assignedTo.includes(member) || module.assignedTo.includes(member)}
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
                                <button
                                    className="save-button"
                                    onClick={() => handleUpdateModule(module._id)}
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
                        {showUpdateTask && showUpdateTask.moduleId === module._id && (
                            <div className="floating-form">
                                <input
                                    type="text"
                                    placeholder="Update Task Name"
                                    value={newTask || showUpdateTask.task.taskName}
                                    onChange={(e) => setNewTask(e.target.value)}
                                    className="input-field"
                                />
                                <div className="member-checkbox-list">
                                    {module.assignedTo.map((member) => (
                                        <label key={member.username} className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                value={member.username}
                                                checked={taskAssignedTo.includes(member) || showUpdateTask.task.assignedTo.includes(member)}
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
                                <button
                                    className="save-button"
                                    onClick={() => handleUpdateTask(module._id, showUpdateTask.task._id, showUpdateTask.task.status, false)}
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
