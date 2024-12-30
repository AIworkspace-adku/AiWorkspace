import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './DashboardPage.module.css';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import RightPanel from './RightPanel';

const DashboardPage = () => {
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		console.log("Hi there");
		// Fetch data from the protected route
		fetch('http://localhost:5000/protected', {
			method: 'POST',
			credentials: 'include',
			withCredentials: true, // Include cookies in the request
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error('Failed to fetch data');
				}
				return response.json();
			})
			.then((data) => {
				console.log(data);
				setData(data);
			})
			.catch((error) => {
				console.log(error);
				setError(error.message)
			});
	}, []);

	if (!data) {
		return <div>Loading...</div>; // Show loading message if data is still being fetched
	}

	return (
		<div className={styles.dashboardContainer}>
			<Sidebar userName={data.username} />
			<MainContent userName={data.username} />
		</div>
	);
};

export default DashboardPage;
