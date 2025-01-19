import React, { useState, useEffect } from "react";
import styles from "./Scheduler.module.css";
import axios from 'axios';

const Scheduler = ({ projectId }) => {
  const [schedule, setSchedule] = useState([]);
  const [meetingDetails, setMeetingDetails] = useState({
    moto: "",
    teamId: "",
    projId: "",
    date: "",
    time: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      axios.post(`${process.env.REACT_APP_BACKEND_URL}/meeting/fetchMeets`, {
        projId: projectId
      })
        .then((response) => {
          if (response.data) {
            setSchedule(response.data.schedules);
          }
        })
        .catch((e) => {
          console.log("There was an error fetchin the meetings", e);
        })
    }
    catch (error) {
      console.log(error);
    }
  }, []);

  // Handles input changes for date, time, and moto
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMeetingDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Adds or updates a meeting
  const handleAddOrEditMeeting = async () => {
    const { date, time, moto } = meetingDetails;

    if (!date || !time || !moto) {
      setError("All fields are required!");
      return;
    }

    if (editIndex !== null) {
      // Update existing meeting
      try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/meeting/updateMeeting`, {
          meetingId: editIndex,
          date: date,
          time: time,
          moto: moto,
          reminder: false
        })
        if (response.data) {
          const updatedSchedule = schedule.map((meet) =>
            meet._id === editIndex ? response.data.updatedMeet : meet
          );
          setSchedule(updatedSchedule);
          setEditIndex(null);
          setMeetingDetails({ moto: "", teamId: "", projId: "", date: "", time: "" });
        }
      }
      catch (error) {
        console.log(error);
      }

    } else {
      // Add new meeting
      try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/meeting/addMeeting`, {
          projId: projectId,
          date: date,
          time: time,
          moto: moto
        })
        if (response.data) {
          setSchedule((prev) => [...prev, { ...response.data.savedMeeting }]);
        }
      }
      catch (error) {
        console.log(error);
      }
    }

    setMeetingDetails({ moto: "", teamId: "", projId: "", date: "", time: "" });
    setError("");
  };

  // Edit handler
  const handleEdit = (meetingId) => {
    const meetingToEdit = schedule.find((meet) => meet._id === meetingId);
    setMeetingDetails(meetingToEdit);
    setEditIndex(meetingId);
  };

  // Delete handler
  const handleDelete = async (meetingId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/meeting/deleteMeeting`, {
        meetingId: meetingId
      })
      if (response.data) {
        setSchedule(schedule.filter((meet) => meet._id !== meetingId));
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.schedulerContainer}>
      <h1 className={styles.title}>Project Scheduler</h1>
      <div className={styles.formContainer}>
        <div className={styles.inputGroup}>
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={meetingDetails.date}
            onChange={handleInputChange}
            className={styles.inputField}
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Time:</label>
          <input
            type="time"
            name="time"
            value={meetingDetails.time}
            onChange={handleInputChange}
            className={styles.inputField}
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Moto:</label>
          <input
            type="text"
            name="moto"
            placeholder="Enter meeting purpose"
            value={meetingDetails.moto}
            onChange={handleInputChange}
            className={styles.inputField}
          />
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <button onClick={handleAddOrEditMeeting} className={styles.addButton}>
          {editIndex !== null ? "Update Meeting" : "Schedule Meeting"}
        </button>
      </div>

      <div className={styles.scheduleList}>
        <h2 className={styles.subTitle}>Scheduled Meetings</h2>
        <div className={styles.cardsContainer}>
          {schedule.length > 0 ? (
            schedule.map((meeting, index) => (
              <div key={meeting._id} className={styles.scheduleItem}>
                <p>
                  <strong>Date:</strong> {meeting.date}
                </p>
                <p>
                  <strong>Time:</strong> {meeting.time}
                </p>
                <p>
                  <strong>Moto:</strong> {meeting.moto}
                </p>
                <div className={styles.actions}>
                  <button
                    onClick={() => handleEdit(meeting._id)}
                    className={styles.editButton}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(meeting._id)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.noMeeting}>No meetings scheduled yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scheduler;
