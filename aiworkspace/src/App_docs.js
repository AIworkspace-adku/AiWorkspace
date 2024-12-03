// src/App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Box, Button, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './docs_components/Sidebar';
import EditorComponent from './docs_components/EditorComponent';
import './App_docs.css';

function WelcomeScreen({ onCreateDocument }) {
	return (
		<Box className="welcome-screen">
			<Typography variant="h3" gutterBottom>
				Welcome to Your Document Editor
			</Typography>
			<Typography variant="h6" gutterBottom>
				Get started by creating a new document
			</Typography>
			<Button
				onClick={onCreateDocument}
				variant="contained"
				color="primary"
				size="large"
				className="welcome-button"
			>
				Create New Document
			</Button>
		</Box>
	);
}

function App() {
	const [documents, setDocuments] = useState([]);
	const [currentDoc, setCurrentDoc] = useState(null);
	const [openDialog, setOpenDialog] = useState(false);
	const [newDocTitle, setNewDocTitle] = useState('');
	const [isSidebarVisible, setIsSidebarVisible] = useState(true);
	const [docToRename, setDocToRename] = useState(null);

	useEffect(() => {
		fetchDocuments();
	}, []);

	const fetchDocuments = async () => {
		try {
			const response = await axios.post('http://localhost:5000/fetchDocuments');
			setDocuments(response.data);
			console.log(response.data);
		} catch (error) {
			console.error('Error fetching documents:', error);
		}
	};

	const handleDialogOpen = () => setOpenDialog(true);
	const handleDialogClose = () => setOpenDialog(false);
	const handleCreateDocument = async () => {
		try {
			const response = await axios.post('http://localhost:5000/documents', {
				title: newDocTitle || 'Untitled Document',
				content: ''
			});
			setDocuments([...documents, response.data]);
			setCurrentDoc(response.data._id);
			setNewDocTitle('');
			handleDialogClose();
		} catch (error) {
			console.error('Error creating document:', error);
		}
	};

	const deleteDocument = async (id) => {
		try {
			await axios.post(`http://localhost:5000/documents/delete/${id}`);
			const updatedDocs = documents.filter(doc => doc._id !== id);
			setDocuments(updatedDocs);
			if (currentDoc === id) {
				setCurrentDoc(null);
			}
		} catch (error) {
			console.error('Error deleting document:', error);
		}
	};

	const renameDocument = (index, newTitle) => {
		const updatedDocs = [...documents];
		updatedDocs[index].title = newTitle;
		setDocuments(updatedDocs);
	};

	const handleRenameClose = () => setDocToRename(null);

	return (
		<div className="app-container">
			{isSidebarVisible && (
				<Sidebar
					documents={documents}
					currentDoc={currentDoc}
					setCurrentDoc={setCurrentDoc}
					addDocument={handleDialogOpen}
					deleteDocument={deleteDocument}
					renameDocument={setDocToRename}
				/>
			)}

			<div className="main-content">
				<div className="toolbar">
					<IconButton onClick={() => setIsSidebarVisible(!isSidebarVisible)} color="primary">
						<MenuIcon />
					</IconButton>
				</div>
				{currentDoc === null ? (
					<WelcomeScreen onCreateDocument={handleDialogOpen} />
				) : (
					<EditorComponent
						document={{
							id: currentDoc,
							content: documents.find(doc => doc._id === currentDoc)?.content || ''
						}}
						onUpdateContent={(content) => {
							const updatedDocs = documents.map(doc =>
								doc._id === currentDoc ? { ...doc, content } : doc
							);
							setDocuments(updatedDocs);
						}}
					/>
				)}
			</div>

			<Dialog open={openDialog} onClose={handleDialogClose}>
				<DialogTitle>New Document</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						label="Document Name"
						fullWidth
						value={newDocTitle}
						onChange={(e) => setNewDocTitle(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDialogClose} color="secondary">
						Cancel
					</Button>
					<Button onClick={handleCreateDocument} color="primary">
						Create
					</Button>
				</DialogActions>
			</Dialog>

			{docToRename !== null && (
				<Dialog open={docToRename !== null} onClose={handleRenameClose}>
					<DialogTitle>Rename Document</DialogTitle>
					<DialogContent>
						<TextField
							autoFocus
							margin="dense"
							label="New Document Name"
							fullWidth
							defaultValue={documents[docToRename]?.title || ''}
							onChange={(e) => renameDocument(docToRename, e.target.value)}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleRenameClose} color="secondary">
							Cancel
						</Button>
						<Button onClick={handleRenameClose} color="primary">
							Rename
						</Button>
					</DialogActions>
				</Dialog>
			)}
		</div>
	);
}

export default App;