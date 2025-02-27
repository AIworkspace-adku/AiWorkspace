const axios = require('axios');

const fetchPapers = async (req, res) => {
    try {
        const { query } = req.body;
        const response = await fetch("https://adku-researchgpt-space.hf.space/predict/", {
            method: "POST", // ✅ Ensure it's a POST request
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ query, top_k: 5 })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return res.status(200).json({ data: data.results });
    } catch (error) {
        console.error("Error fetching research papers:", error.message);
        return null;
    }
};

module.exports = {
    fetchPapers
}