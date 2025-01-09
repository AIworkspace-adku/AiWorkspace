import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Hero from './components/herosection/Hero';
import Infinite from './components/infinitescroller/Infinite';
import Features from './components/features/Features';
import Testimonial from './components/testimonial/Testimonial';
import Footer from './components/footer/Footer';
import './App.css';
import axios from 'axios';

function App() {

	const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		// Fetch data from the protected route
		fetch('http://localhost:5000/protected', {
			method: 'POST',
			credentials: 'include',
			withCredentials: true, // Include cookies in the request
		})
			.then((response) => {
				if (!response.ok) {
					if (response.status === 403) {
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
			})
			.catch((error) => {
				console.error('Fetch error:', error);
			});
	}, []);

	return (
		<React.StrictMode>

			<Navbar setData={setData} data={data} />

			<div className='hero'>
				<Hero data={data} />
			</div>
			<Infinite />


			<Features />

		</React.StrictMode>
	)
}

export default App;
