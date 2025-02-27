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
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter your query"
                />
                <button type="submit">Search</button>
            </form>
            <ul>
                {results.map((result, index) => (
                    <li key={index}>
                        <h3>{result.title}</h3>
                        <p>{result.authors.join(', ')}</p>
                        <p>{result.abstract}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Gpt;