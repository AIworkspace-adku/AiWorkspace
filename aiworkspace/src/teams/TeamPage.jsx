import React, { useState, useEffect } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Sidebar from "../components/dashboardpage/Sidebar"; // Consistent Sidebar import
import styles from "./TeamPage.module.css";

// Dummy data for teams
const dummyTeams = [
  {
    id: "team_alpha",
    name: "Team Santra",
    members: ["Ayush", "krithik", "Unnati","Disha"],
    projects: [
      { id: "project_a", name: "Project A", progress: 50 },
      { id: "project_b", name: "Project B", progress: 75 },
    ],
  },
  {
    id: "team_beta",
    name: "Team Beta",
    members: ["David", "Eve"],
    projects: [
      { id: "project_c", name: "Project C", progress: 30 },
      { id: "project_d", name: "Project D", progress: 90 },
    ],
  },
];

const TeamPage = () => {
  const { teamId } = useParams(); // Get the team ID from the URL
  const [team, setTeam] = useState(null);
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [newMember, setNewMember] = useState("");
  const [newProject, setNewProject] = useState("");

  // Load team data on component mount
  useEffect(() => {
    const selectedTeam = dummyTeams.find((t) => t.id === teamId);
    setTeam(selectedTeam);

    if (selectedTeam) {
      setTeamName(selectedTeam.name);
      setMembers(selectedTeam.members);
      setProjects(selectedTeam.projects);
    }
  }, [teamId]);

  if (!team) return <div>Loading...</div>;

  // Handlers
  const handleTeamNameUpdate = () => {
    alert("Team name updated successfully!"); // Placeholder for backend update
  };

  const addMember = () => {
    if (newMember.trim()) {
      setMembers([...members, newMember.trim()]);
      setNewMember("");
    }
  };

  const removeMember = (member) => {
    setMembers(members.filter((m) => m !== member));
  };

  const addProject = () => {
    if (newProject.trim()) {
      const newProjectObj = {
        id: Date.now(),
        name: newProject.trim(),
        progress: 0,
      };
      setProjects([...projects, newProjectObj]);
      setNewProject("");
    }
  };

  const removeProject = (projectId) => {
    const updatedProjects = projects.filter((project) => project.id !== projectId);
    setProjects(updatedProjects);
  };

  return (
    <div className={styles.teamPage}>
      <Sidebar /> {/* Consistent Sidebar */}

      <div className={styles.content}>
        {/* Top Section: Team Name */}
        <div className={styles.header}>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className={styles.teamNameInput}
          />
          <button onClick={handleTeamNameUpdate} className={styles.actionButton}>
            <FaEdit /> Edit
          </button>
        </div>

        {/* Middle Section: Members */}
        <div className={styles.membersSection}>
          <h3>Team Members</h3>
          <ul className={styles.membersList}>
            {members.map((member, index) => (
              <li key={index} className={styles.memberItem}>
                {member}
                <button
                  onClick={() => removeMember(member)}
                  className={styles.removeButton}
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
          <div className={styles.addMember}>
            <input
              type="text"
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
              placeholder="Add Member"
              className={styles.memberInput}
            />
            <button onClick={addMember} className={styles.addButton}>
              <FaPlus /> Add
            </button>
          </div>
        </div>

        {/* Bottom Section: Projects */}
        <div className={styles.projectsSection}>
          <h3>Projects</h3>
          <div className={styles.projectGrid}>
            {projects.map((project) => (
              <a
                key={project.id}
                href="/projects/{project.id}"
                className={styles.projectCard}
                title={`Progress: ${project.progress}%`}
              >
                <h4>{project.name}</h4>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </a>
            ))}
          </div>
          <div className={styles.addProject}>
            <input
              type="text"
              value={newProject}
              onChange={(e) => setNewProject(e.target.value)}
              placeholder="Add Project"
              className={styles.projectInput}
            />
            <button onClick={addProject} className={styles.addButton}>
              <FaPlus /> Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
