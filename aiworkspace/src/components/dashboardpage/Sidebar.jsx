import React, { useState } from 'react';
import styles from './Sidebar.module.css';
import { FaFolder, FaFolderOpen, FaFileAlt, FaEllipsisH, FaUser, FaTasks, FaPlus } from 'react-icons/fa';

const Sidebar = () => {
  const [yourTeams, setYourTeams] = useState([
    {
      type: 'folder',
      name: 'Team Alpha',
      id: 'team_alpha',
      children: [
        { type: 'file', name: 'Project A', id: 'project_a' },
        { type: 'file', name: 'Project B', id: 'project_b' }
      ]
    }
  ]);

  const [memberTeams, setMemberTeams] = useState([]); // Teams user is a member of
  const [expanded, setExpanded] = useState({ yourTeams: true, teams: true });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createContext, setCreateContext] = useState({ parentId: null, type: 'folder' });
  const [showOptionsFor, setShowOptionsFor] = useState(null);

  const toggleExpand = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCreateTeam = () => {
    setCreateContext({ parentId: null, type: 'folder' });
    setShowCreateModal(true);
  };

  const handleCreateProject = (teamId) => {
    setCreateContext({ parentId: teamId, type: 'file' });
    setShowCreateModal(true);
  };

  const handleItemCreated = (newItem) => {
    if (createContext.parentId === null) {
      // Creating a new team
      setYourTeams((prev) => [...prev, newItem]);
    } else {
      // Adding a project to a team
      setYourTeams((prev) =>
        prev.map((team) =>
          team.id === createContext.parentId
            ? { ...team, children: [...team.children, newItem] }
            : team
        )
      );
    }
    setShowCreateModal(false);
  };

  const renderProject = (project) => (
    <div className={styles.nodeContainer} key={project.id}>
      <div className={styles.nodeHeader}>
        <div className={styles.nodeInfo}>
          <FaFileAlt />
          <span className={styles.nodeName}>{project.name}</span>
        </div>
      </div>
    </div>
  );

  const renderTeam = (team) => {
    const isTeamExpanded = expanded[team.id] !== false;

    return (
      <div className={styles.nodeContainer} key={team.id}>
        <div className={styles.nodeHeader}>
          <a
            href={`/teams/${team.id}`} // Use href for navigation
            className={styles.nodeInfo}
          >
            {isTeamExpanded ? <FaFolderOpen /> : <FaFolder />}
            <span className={styles.nodeName}>{team.name}</span>
          </a>
          <button className={styles.optionsBtn} onClick={() => setShowOptionsFor(team.id)}>
            <FaEllipsisH />
          </button>
          {showOptionsFor === team.id && (
            <div className={styles.optionsMenu}>
              <div
                className={styles.optionsMenuItem}
                onClick={() => handleCreateProject(team.id)}
              >
                Add Project
              </div>
            </div>
          )}
        </div>
        {isTeamExpanded && team.children && (
          <div className={styles.children}>
            {team.children.map(renderProject)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.sidebar}>
      {/* Your Teams */}
      <div className={styles.nodeContainer}>
        <div className={styles.nodeHeader}>
          <div className={styles.nodeInfo} onClick={() => toggleExpand('yourTeams')}>
            {expanded.yourTeams ? <FaFolderOpen /> : <FaFolder />}
            <span className={styles.nodeName}>Your Teams</span>
          </div>
          <button className={styles.optionsBtn} onClick={handleCreateTeam}>
            <FaPlus />
          </button>
        </div>
        {expanded.yourTeams && (
          <div className={styles.children}>
            {yourTeams.map(renderTeam)}
          </div>
        )}
      </div>

      {/* Member Teams */}
      <div className={styles.nodeContainer}>
        <div className={styles.nodeHeader}>
          <div className={styles.nodeInfo} onClick={() => toggleExpand('teams')}>
            {expanded.teams ? <FaFolderOpen /> : <FaFolder />}
            <span className={styles.nodeName}>Teams</span>
          </div>
        </div>
        {expanded.teams && memberTeams.length > 0 && (
          <div className={styles.children}>
            {memberTeams.map(renderTeam)}
          </div>
        )}
      </div>

      {/* Tasks */}
      <div className={styles.nodeContainer}>
        <div className={styles.nodeHeader}>
          <div className={styles.nodeInfo}>
            <FaTasks />
            <span className={styles.nodeName}>Tasks</span>
          </div>
        </div>
      </div>

      {/* Profile */}
      <div className={styles.nodeContainer}>
        <div className={styles.nodeHeader}>
          <div className={styles.nodeInfo}>
            <FaUser />
            <span className={styles.nodeName}>Profile</span>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer}>
            <h2>Create New {createContext.type === 'folder' ? 'Team' : 'Project'}</h2>
            <input
              type="text"
              className={styles.modalInput}
              placeholder={
                createContext.type === 'folder' ? 'Team Name' : 'Project Name'
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const name = e.target.value.trim();
                  if (!name) return;
                  const id = `${createContext.type}_${Date.now()}`;
                  const newItem = { type: createContext.type, name, id };
                  if (createContext.type === 'folder') {
                    newItem.children = [];
                  }
                  handleItemCreated(newItem);
                }
              }}
            />
            <button
              className={styles.submitBtn}
              onClick={() => {
                const input = document.querySelector(`.${styles.modalInput}`);
                const name = input.value.trim();
                if (!name) return;
                const id = `${createContext.type}_${Date.now()}`;
                const newItem = { type: createContext.type, name, id };
                if (createContext.type === 'folder') {
                  newItem.children = [];
                }
                handleItemCreated(newItem);
              }}
            >
              Create
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
