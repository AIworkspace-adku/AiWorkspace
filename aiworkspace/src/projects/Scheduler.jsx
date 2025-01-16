import React, { useState } from "react";
import styles from "./Scheduler.module.css";

const Scheduler = () => {
  const [schedule, setSchedule] = useState([]);
  const [meetingDetails, setMeetingDetails] = useState({
    date: "",
    time: "",
    moto: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState("");

  // Handles input changes for date, time, and moto
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMeetingDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Adds or updates a meeting
  const handleAddOrEditMeeting = () => {
    const { date, time, moto } = meetingDetails;

    if (!date || !time || !moto) {
      setError("All fields are required!");
      return;
    }

    if (editIndex !== null) {
      // Update existing meeting
      const updatedSchedule = [...schedule];
      updatedSchedule[editIndex] = meetingDetails;
      setSchedule(updatedSchedule);
      setEditIndex(null);
    } else {
      // Add new meeting
      setSchedule((prev) => [...prev, { ...meetingDetails }]);
    }

    setMeetingDetails({ date: "", time: "", moto: "" });
    setError("");
  };

  // Edit handler
  const handleEdit = (index) => {
    setMeetingDetails(schedule[index]);
    setEditIndex(index);
  };

  // Delete handler
  const handleDelete = (index) => {
    const updatedSchedule = schedule.filter((_, i) => i !== index);
    setSchedule(updatedSchedule);
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
              <div key={index} className={styles.scheduleItem}>
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
                    onClick={() => handleEdit(index)}
                    className={styles.editButton}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
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
