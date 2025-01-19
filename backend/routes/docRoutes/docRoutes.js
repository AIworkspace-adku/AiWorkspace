const express = require('express');
const documentController = require('../../controllers/documentControllers');
const router = express.Router();

router.post('/saveDocument', documentController.saveDocument);
router.post('/gemini-query', documentController.geminiQueries);
router.get('/getDocument/:id', documentController.getDocuments);
router.post('/documents', documentController.createDocument);
router.post('/fetchDocuments', documentController.fetchDocuments);
router.post('/renameDocuments/:id/:title', documentController.renameDocuments);
router.post('/documents/delete/:id', documentController.deleteDocuments);

module.exports = router;