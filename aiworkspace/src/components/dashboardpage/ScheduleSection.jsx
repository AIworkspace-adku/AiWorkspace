import React, { useState, useEffect } from "react";
import { FaEdit, FaCheck, FaBell, FaBellSlash } from "react-icons/fa";
import styles from "./ScheduleSection.module.css";

const ScheduleSection = () => {
  const [schedule, setSchedule] = useState([
    { id: 1, time: "19:45", activity: "Team Standup", reminder: true },
    { id: 2, time: "11:00", activity: "Client Meeting", reminder: false },
    { id: 3, time: "14:00", activity: "Development Work", reminder: false },
  ]);

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
        item.id === id ? { ...item, reminder: !item.reminder } : item
      )
    );
  };

  // Edit Schedule
  const startEditing = (item) => {
    setEditingId(item.id);
    setEditedTime(item.time);
    setEditedActivity(item.activity);
  };

  const saveEdits = (id) => {
    setSchedule(
      schedule.map((item) =>
        item.id === id
          ? { ...item, time: editedTime, activity: editedActivity }
          : item
      )
    );
    setEditingId(null);
  };

  return (
    <div className={styles.scheduleWrapper}>
      <h3>Today's Schedule</h3>
      <ul className={styles.scheduleList}>
        {schedule.map((item) => (
          <li key={item.id} className={styles.scheduleItem}>
            {editingId === item.id ? (
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
                  onClick={() => saveEdits(item.id)}
                  className={styles.saveButton}
                >
                  <FaCheck size={24} />
                </button>
              </>
            ) : (
              <>
                <span className={styles.time}>{item.time}</span>
                <span className={styles.activity}>{item.activity}</span>
                <div className={styles.actions}>
                  <button
                    onClick={() => startEditing(item)}
                    className={styles.actionButton}
                  >
                    <FaEdit size={24} />
                  </button>
                  <button
                    onClick={() => toggleReminder(item.id)}
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
