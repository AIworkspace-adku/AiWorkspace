import React, { useState } from 'react';
import styles from './Sidebar.module.css';
import { FaFolder, FaFolderOpen, FaFileAlt, FaEllipsisH, FaUser, FaTasks, FaPlus } from 'react-icons/fa';

const Sidebar = ({ userName }) => {
  // Sample data structure:
  // "Your Teams" -> array of teams (folders), each team can have projects (files)
  // "Teams" -> user is a member (for now, empty)
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

  const [memberTeams, setMemberTeams] = useState([]); // teams user is member of
  const [expanded, setExpanded] = useState({ yourTeams: true, teams: true });
  
  // Context menus and modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createContext, setCreateContext] = useState({ parentId: null, type: 'folder', parentType: 'yourTeams' });
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameContext, setRenameContext] = useState({ id: null, currentName: '', parentType: 'yourTeams' });
  const [showOptionsFor, setShowOptionsFor] = useState(null);

  // Handlers
  const toggleExpand = (key) => {
    setExpanded({ ...expanded, [key]: !expanded[key] });
  };

  const handleCreateTeam = () => {
    // Create a new team under "Your Teams"
    setCreateContext({ parentId: null, type: 'folder', parentType: 'yourTeams' });
    setShowCreateModal(true);
  };

  const handleCreateProject = (teamId) => {
    // Create a new project under a specific team
    setCreateContext({ parentId: teamId, type: 'file', parentType: 'yourTeams' });
    setShowCreateModal(true);
  };

  const handleItemCreated = (newItem) => {
    if (createContext.parentId === null) {
      // Creating a new team under Your Teams
      setYourTeams([...yourTeams, newItem]);
    } else {
      // Creating a project inside a team
      const updated = yourTeams.map(t => {
        if (t.id === createContext.parentId) {
          return { ...t, children: [...t.children, newItem] };
        }
        return t;
      });
      setYourTeams(updated);
    }
  };

  const handleRename = (id, newName) => {
    const renameInList = (list) => list.map(item => {
      if (item.id === id) {
        return { ...item, name: newName };
      } else if (item.type === 'folder') {
        return { ...item, children: renameInList(item.children) };
      }
      return item;
    });

    setYourTeams(renameInList(yourTeams));
  };

  const handleDelete = (itemId) => {
    const deleteFromList = (list) => list
      .filter(item => item.id !== itemId)
      .map(item => item.type === 'folder' ? { ...item, children: deleteFromList(item.children) } : item);

    setYourTeams(deleteFromList(yourTeams));
  };

  // Render Helpers
  const renderProject = (project) => {
    return (
      <div className={styles.nodeContainer} key={project.id} onMouseLeave={() => setShowOptionsFor(null)}>
        <div className={styles.nodeHeader}>
          <div className={styles.nodeInfo}>
            <FaFileAlt />
            <span className={styles.nodeName}>{project.name}</span>
          </div>
          <button className={styles.optionsBtn} onClick={() => setShowOptionsFor(project.id)}>
            <FaEllipsisH />
          </button>
          {showOptionsFor === project.id && (
            <div className={styles.optionsMenu}>
              <div className={styles.optionsMenuItem} onClick={() => {
                setRenameContext({ id: project.id, currentName: project.name });
                setShowRenameModal(true);
                setShowOptionsFor(null);
              }}>Rename</div>
              <div className={styles.optionsMenuItem} onClick={() => {
                handleDelete(project.id);
                setShowOptionsFor(null);
              }}>Delete</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTeam = (team) => {
    const isTeamExpanded = expanded[team.id] !== false;
    return (
      <div className={styles.nodeContainer} key={team.id} onMouseLeave={() => setShowOptionsFor(null)}>
        <div className={styles.nodeHeader}>
          <div className={styles.nodeInfo} onClick={() => setExpanded({ ...expanded, [team.id]: !isTeamExpanded })}>
            {isTeamExpanded ? <FaFolderOpen /> : <FaFolder />}
            <span className={styles.nodeName}>{team.name}</span>
          </div>
          <button className={styles.optionsBtn} onClick={() => setShowOptionsFor(team.id)}>
            <FaEllipsisH />
          </button>
          {showOptionsFor === team.id && (
            <div className={styles.optionsMenu}>
              <div className={styles.optionsMenuItem} onClick={() => handleCreateProject(team.id)}>Add Project</div>
              <div className={styles.optionsMenuItem} onClick={() => {
                setRenameContext({ id: team.id, currentName: team.name });
                setShowRenameModal(true);
                setShowOptionsFor(null);
              }}>Rename</div>
              <div className={styles.optionsMenuItem} onClick={() => {
                handleDelete(team.id);
                setShowOptionsFor(null);
              }}>Delete</div>
            </div>
          )}
        </div>
        {isTeamExpanded && team.children && team.children.length > 0 && (
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
        {expanded.yourTeams && yourTeams.length > 0 && (
          <div className={styles.children}>
            {yourTeams.map(renderTeam)}
          </div>
        )}
      </div>

      {/* Teams (User is a member) */}
      <div className={styles.nodeContainer}>
        <div className={styles.nodeHeader}>
          <div className={styles.nodeInfo} onClick={() => toggleExpand('teams')}>
            {expanded.teams ? <FaFolderOpen /> : <FaFolder />}
            <span className={styles.nodeName}>Teams</span>
          </div>
        </div>
        {expanded.teams && memberTeams.length > 0 && (
          <div className={styles.children}>
            {/* Show teams the user is member of (if any) */}
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
              placeholder={createContext.type === 'folder' ? 'Team Name' : 'Project Name'} 
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
                  setShowCreateModal(false);
                }
              }}
            />
            <div className={styles.buttonGroup}>
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
                  setShowCreateModal(false);
                }}
              >Create</button>
              <button className={styles.cancelBtn} onClick={() => setShowCreateModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {showRenameModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer}>
            <h2>Rename</h2>
            <input 
              type="text" 
              className={styles.modalInput}
              defaultValue={renameContext.currentName} 
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const newName = e.target.value.trim();
                  if (!newName) return;
                  handleRename(renameContext.id, newName);
                  setShowRenameModal(false);
                }
              }}
            />
            <div className={styles.buttonGroup}>
              <button 
                className={styles.submitBtn} 
                onClick={() => {
                  const input = document.querySelector(`.${styles.modalInput}`);
                  const newName = input.value.trim();
                  if (!newName) return;
                  handleRename(renameContext.id, newName);
                  setShowRenameModal(false);
                }}
              >Save</button>
              <button className={styles.cancelBtn} onClick={() => setShowRenameModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
