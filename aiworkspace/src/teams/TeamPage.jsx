import React, { useState, useEffect } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/dashboardpage/Sidebar.jsx"; // Consistent Sidebar import
import styles from "./TeamPage.module.css";

const TeamPage = () => {
  const { teamId } = useParams(); // Get the team ID from the URL
  const [team, setTeam] = useState(null);
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [newMemberEmail, setNewMember] = useState("");
  const [newProject, setNewProject] = useState("");

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [owner, setOwner] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Fetch data from the protected route
    fetch(`${process.env.REACT_APP_BACKEND_URL}/protected`, {
      method: 'POST',
      credentials: 'include',
      withCredentials: true, // Include cookies in the request
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
						navigate('/session-timeout');
					}
					else {
						throw new Error('Failed to fetch data');
					}
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setOwner(data.email);
        setUserName(data.username);
      })
      .catch((error) => {
        console.log(error);
        setError(error.message)
      });
  }, []);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/getTeamById`, {
          teamId,
        });

        if (response.data) {
          setTeam(response.data.team);
          setTeamName(response.data.team.teamName);
          setMembers(response.data.team.members);
          // setProjects(response.data.team.projects);
        } else {
          console.log('No teams found');
        }
      } catch (error) {
        console.log(error.response?.data?.message || 'Something went wrong, try again.');
      }
    };

    fetchTeams();
  }, [data, teamId]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/getProjByTeamId`, {
          teamId,
        });

        if (response.data) {
          setProjects(response.data);
          // setProjects(response.data.team.projects);
        } else {
          console.log('No teams found');
        }
      } catch (error) {
        console.log(error.response?.data?.message || 'Something went wrong, try again.');
      }
    };

    fetchProjects();
  }, [data, teamId]);

  if (!data || !team) {
    return <div>Loading...</div>;
  }

  // Handlers
  const handleTeamNameUpdate = async() => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/updateTeamName`, {
        teamId,
        teamName,
      });

      if (response.data.team) {
        alert('Team name updated successfully!');
      } else {
        console.log('Team name not updated');
      }
    }
    catch (error) {
      console.log(error.response?.data?.message || 'Something went wrong, try again.');
    }
  };

  const addMember = async () => {
    if (newMemberEmail === team.owner.email) {
      alert('You are already the owner of the team!');
      return;
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/addMemberToTeam`, {
        teamId,
        newMemberEmail,
      });

      if (response.data) {
        alert('Member added successfully!');
        setMembers([...members, response.data.newMember]);
        setNewMember("");
      } else {
        console.log('Member not added');
      }
    } catch (error) {
      console.log(error.response?.data?.message || 'Something went wrong, try again')
    }
  };

  const removeMember = (member) => {

    try {
      const response = axios.post(`${process.env.REACT_APP_BACKEND_URL}/removeMemberFromTeam`, {
        teamId,
        memberEmail: member.email,
      });

      if (response) {
        alert('Member removed successfully!');
      } else {
        console.log('Member not removed');
      }
    }
    catch (error) {
      console.log(error.response?.data?.message || 'Something went wrong while removing member, try again');
    }

    setMembers(members.filter((m) => m !== member));
  };

  const handleSubmitProject = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/createProject`, {
        projName: newProject,
        teamId,
        owner: owner,
        ownerName: userName,
      },
        {
          withCredentials: true
        });

      if (response.data) {
        setProjects([...projects, response.data.savedProject]);
        setNewProject("");
        alert('Project created successfully!');
      } else {
        console.log('Project not created');
      }
    }
    catch (error) {
      console.log(error.response?.data?.message || 'Something went wrong while creating project, try again.');
    }
  }

  const removeProject = (projectId) => {
    const updatedProjects = projects.filter((project) => project.id !== projectId);
    setProjects(updatedProjects);
  };

  return (
    <div className={styles.teamPage}>
      <Sidebar setData={setData} userData={data} /> {/* Consistent Sidebar */}

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

        {/* Owner Section: Owner */}
        <div className={styles.membersSection}>
          <h3>Team Admin</h3>
          <ul className={styles.membersList}>
            {team.owner.username}
          </ul>
        </div>

        {/* Middle Section: Members */}
        <div className={styles.membersSection}>
          <h3>Team Members</h3>
          <ul className={styles.membersList}>
            {members.map((member, index) => (
              <li key={index} className={styles.memberItem}>
                {member.username}
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
              value={newMemberEmail}
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
                key={project._id}
                href={`/projects/${project._id}`}
                className={styles.projectCard}
                title={`Progress: ${project.progress}%`}
              >
                <h4>{project.projName}</h4>
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
            <button onClick={handleSubmitProject} className={styles.addButton}>
              <FaPlus /> Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
