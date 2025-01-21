import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './DashboardPage.module.css';
import Sidebar from './Sidebar.jsx';
import MainContent from './MainContent.jsx';
import RightPanel from './RightPanel.jsx';

const DashboardPage = () => {
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		console.log(process.env.REACT_APP_BACKEND_URL);
		// Fetch data from the protected route
		fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/protected`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
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
			<Sidebar setData={setData} userData={data} />
			<MainContent userData={data} />
		</div>
	);
};

export default DashboardPage;
