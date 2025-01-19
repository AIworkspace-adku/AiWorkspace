const Document = require('../models/Document');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const saveDocument = async (req, res) => {
    const { documentId, content } = req.body;

    try {
        // Find the document by ID and update its content
        const document = await Document.findByIdAndUpdate(
            documentId,
            { content, lastModified: new Date() },
            { new: true, upsert: true } // Create document if it doesn't exist
        );

        res.status(200).json({ message: 'Document saved successfully', document });
    } catch (error) {
        console.error('Error saving document:', error);
        res.status(500).json({ message: 'Error saving document', error });
    }
};

const geminiQueries = async (req, res) => {
    const { query } = req.body;

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = query;

        const result = await model.generateContent(prompt);

        console.log("Full response from Gemini API:", result);
        const suggestions = result.response.text()

        res.status(200).json({ suggestions });
    } catch (error) {
        console.error('Error querying Gemini API:', error.message);
        console.error('Full error:', error);
        res.status(500).json({ error: 'Failed to fetch suggestions' });
    }
}

const getDocuments = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        if (document) {
            res.status(200).json({ content: document.content });
        } else {
            res.status(404).json({ message: 'Document not found' });
        }
    } catch (error) {
        console.error('Error fetching document:', error);
        res.status(500).json({ message: 'Error fetching document', error });
    }
};

const createDocument = async (req, res) => {
    try {
        const document = new Document(req.body);
        await document.save();
        res.status(201).send(document);
    } catch (error) {
        res.status(400).send(error);
    }
};

const fetchDocuments = async (req, res) => {
    try {
        const { projId } = req.body;
        const documents = await Document.find({ 'owner.projId': projId });
        res.json(documents);
    } catch (error) {
        res.status(500).send(error);
    }
};

const renameDocuments = async (req, res) => {
	try {
		const documents = await Document.findByIdAndUpdate(
			req.params.id,
			{ $set: { title: req.params.title } }
		);
		res.json(documents);
	} catch (error) {
		res.status(500).send(error);
	}
};

const deleteDocuments = async (req, res) => {
    try {
        const document = await Document.findByIdAndDelete(req.params.id);
        if (!document) {
            return res.status(404).send();
        }
        res.send(document);
    } catch (error) {
        res.status(500).send(error);
    }
};

module.exports = {
    saveDocument,
    geminiQueries,
    getDocuments,
    createDocument,
    fetchDocuments,
    renameDocuments,
    deleteDocuments
};