import React, { useState } from 'react';
import axios from 'axios';

function Gpt() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/Gpt/predict`, { query });
            console.log(response.data.data);
            setResults(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <iframe
            src="https://adku-researchgpt-space.hf.space"
            frameborder="0"
            width="1200"
            height="900"
        ></iframe>

    );
}

export default Gpt;