import React, { useState, useEffect } from "react";
import axios from 'axios';
import { FaEdit, FaCheck, FaBell, FaBellSlash } from "react-icons/fa";
import styles from "./ScheduleSection.module.css";

const ScheduleSection = ({ userData }) => {
  const [schedule, setSchedule] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editedTime, setEditedTime] = useState("");
  const [editedActivity, setEditedActivity] = useState("");
  const [showCustomNotification, setShowCustomNotification] = useState(false);
  const [notificationContent, setNotificationContent] = useState("");

  // Request Notification Permission
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    fetchMeets();
  }, [userData]);

  const fetchMeets = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/meeting/fetchTodaySchedule`, {
        email: userData.email
      })
      if (response.data) {
        setSchedule(response.data.schedule);
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  // Function to check and trigger reminders
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date();
      const formattedTime = currentTime.toTimeString().slice(0, 5); // HH:mm format

      schedule.forEach((item) => {
        if (item.reminder && item.time === formattedTime) {
          triggerNotification(item.activity);
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [schedule]);

  // Function to trigger system notification
  const triggerNotification = (activity) => {
    if (Notification.permission === "granted") {
      setNotificationContent(`It's time for: ${activity}`);
      setShowCustomNotification(true);
      setTimeout(() => setShowCustomNotification(false), 10000);
    }
  };

  // Toggle Reminder
  const toggleReminder = (id) => {
    setSchedule(
      schedule.map((item) =>
        item._id === id ? { ...item, reminder: !item.reminder } : item
      )
    );
  };

  // Edit Schedule
  const startEditing = (item) => {
    setEditingId(item._id);
    setEditedTime(item.time);
    setEditedActivity(item.moto);
  };

  const saveEdits = async (id, date, reminder, reminderUpdate) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/meeting/updateMeeting`, {
        meetingId: id,
        date: date,
        time: editedTime,
        moto: editedActivity,
        reminder: reminder,
        reminderUpdate: reminderUpdate
      })
      if (response.data) {
        const updatedSchedule = schedule.map((meet) =>
          meet._id === id ? response.data.updatedMeet : meet
        );
        setSchedule(updatedSchedule);
      }
    }
    catch (error) {
      console.log(error);
    }
    setEditingId(null);
  };

  return (
    <div className={styles.scheduleWrapper}>
      <h3>Today's Schedule</h3>
      <ul className={styles.scheduleList}>
        {schedule.map((item) => (
          <li key={item._id} className={styles.scheduleItem}>
            {editingId === item._id ? (
              <>
                <input
                  type="time"
                  value={editedTime}
                  onChange={(e) => setEditedTime(e.target.value)}
                  className={styles.timeInput}
                />
                <input
                  type="text"
                  value={editedActivity}
                  onChange={(e) => setEditedActivity(e.target.value)}
                  className={styles.activityInput}
                  placeholder="Edit Activity"
                />
                <button
                  onClick={() => saveEdits(item._id, item.date, false, false)}
                  className={styles.saveButton}
                >
                  <FaCheck size={24} />
                </button>
              </>
            ) : (
              <>
                <span className={styles.time}>{item.time}</span>
                <span className={styles.activity}>{item.moto}</span>
                <div className={styles.actions}>
                  <button
                    onClick={() => startEditing(item)}
                    className={styles.actionButton}
                  >
                    <FaEdit size={24} />
                  </button>
                  <button
                    onClick={() => saveEdits(item._id, "", !item.reminder, true)}
                    className={styles.actionButton}
                  >
                    {item.reminder ? (
                      <FaBell size={24} />
                    ) : (
                      <FaBellSlash size={24} />
                    )}
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
        {schedule.length === 0 && (
          <>
            <span className={styles.time}></span>
            <span className={styles.activity}>There are no meetings scheduled for today</span>
          </>
        )}
      </ul>

      {/* Custom Notification */}
      {showCustomNotification && (
        <div className={styles.customNotification}>
          <p>{notificationContent}</p>
        </div>
      )}
    </div>
  );
};

export default ScheduleSection;
