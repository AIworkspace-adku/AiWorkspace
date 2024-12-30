// src/App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Box, Button, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './docs_components/Sidebar';
import CloseIcon from '@mui/icons-material/Close';
import EditorComponent from './docs_components/EditorComponent';
import './App_docs.css';

function WelcomeScreen({ onCreateDocument, username }) {
	return (
		<Box className="welcome-screen">
			<Typography variant="h3" gutterBottom>
				Welcome to Your Document Editor {username}
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

function App_docs() {
	const [documents, setDocuments] = useState([]);
	const [openDocuments, setOpenDocuments] = useState([]);
	const [currentDoc, setCurrentDoc] = useState(null);
	const [openDialog, setOpenDialog] = useState(false);
	const [newDocTitle, setNewDocTitle] = useState('');
	const [isSidebarVisible, setIsSidebarVisible] = useState(true);
	const [docToRename, setDocToRename] = useState(null);
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (data) {
			fetchDocuments();
		}
	}, [data]);

	useEffect(() => {
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
				setData(data);
			})
			.catch((error) => {
				console.log(error);
				setError(error.message)
			});
	}, []);

	const fetchDocuments = async () => {
		try {
			const response = await axios.post('http://localhost:5000/fetchDocuments', {
				owner: data.email
			});
			setDocuments(response.data);
			// console.log(response.data);
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
				owner: data.email,
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

	const setOnToolbar = (docs) => {
		setOpenDocuments([openDocuments, ...docs]);
	}

	const onCloseDocument = (docId) => {
		setOpenDocuments((prevDocs) => prevDocs.filter((doc) => doc.id !== docId));
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
					onClick={() => setOnToolbar(documents)}
				/>
			)}

			<div className="main-content">
				<div className="toolbar">
					<IconButton onClick={() => setIsSidebarVisible(!isSidebarVisible)} color="primary">
						<MenuIcon />
					</IconButton>

					<div className="open-documents">
						{openDocuments.map((doc) => (
							<div key={doc._id} className="open-document-item">
								<span>{doc.title}</span> {/* Display the document name */}
								<IconButton
									onClick={() => onCloseDocument(doc._id)} // Close document handler
									color="secondary"
									size="small"
								>
									<CloseIcon />
								</IconButton>
							</div>
						))}
					</div>
				</div>
				{currentDoc === null ? (
					<WelcomeScreen onCreateDocument={handleDialogOpen} username={data ? data.username : ''} />
				) : (
					<EditorComponent
						userData={data}
						document_data={{
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

export default App_docs;