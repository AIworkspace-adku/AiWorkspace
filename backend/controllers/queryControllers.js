const axios = require('axios');

const fetchPapers = async (req, res) => {
    try {
        const { query } = req.body;
        const response = await axios.post('https://research-gpt-latest.onrender.com/predict', { query });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

module.exports = {
    fetchPapers
}