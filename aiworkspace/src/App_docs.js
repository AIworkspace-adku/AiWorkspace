import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    Typography,
    Box,
    Button,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './docs_components/Sidebar';
import CloseIcon from '@mui/icons-material/Close';
import EditorComponent from './docs_components/EditorComponent';
import './App_docs.css';

function WelcomeScreen({ onCreateDocument, username }) {
    return (
        <Box className="welcome-screen">
            <Typography variant="h3" gutterBottom>
                Welcome to Your Document Editor, {username}
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
    const { projId } = useParams();
    const [documents, setDocuments] = useState([]);
    const [currentDoc, setCurrentDoc] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [newDocTitle, setNewDocTitle] = useState('');
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [docToRename, setDocToRename] = useState(null);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    // Fetch user data and documents
    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await fetch('http://localhost:5000/protected', {
                method: 'POST',
                credentials: 'include',
                withCredentials: true,
            });

            if (!response.ok) throw new Error('Failed to fetch user data');

            const userData = await response.json();
            setData(userData);

            // Fetch documents after user data is set
            fetchDocuments(userData.email);
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchDocuments = async (owner) => {
        try {
            const response = await axios.post('http://localhost:5000/fetchDocuments', { owner });
            setDocuments(response.data);
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    // Create a new document
    const handleCreateDocument = async () => {
        try {
            const response = await axios.post('http://localhost:5000/documents', {
                title: newDocTitle || 'Untitled Document',
                owner: data.email,
                content: '',
            });

            setDocuments((prevDocs) => [...prevDocs, response.data]);
            setCurrentDoc(response.data._id);
            setNewDocTitle('');
            setOpenDialog(false);
        } catch (error) {
            console.error('Error creating document:', error);
        }
    };

    // Delete a document
    const deleteDocument = async (id) => {
        try {
            await axios.post(`http://localhost:5000/documents/delete/${id}`);
            setDocuments((prevDocs) => prevDocs.filter((doc) => doc._id !== id));

            if (currentDoc === id) {
                setCurrentDoc(null);
            }
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    };

    // Rename a document
    const renameDocument = async (id, newTitle) => {
        try {
            await axios.post(`http://localhost:5000/renameDocuments/${id}/${newTitle}`);
            setDocuments((prevDocs) =>
                prevDocs.map((doc) =>
                    doc._id === id ? { ...doc, title: newTitle } : doc
                )
            );
            setDocToRename(null);
        } catch (error) {
            console.error('Error renaming document:', error);
        }
    };

    const handleDialogClose = () => setOpenDialog(false);
    const handleRenameClose = () => setDocToRename(null);

    return (
        <div className="app-container">
            {/* Sidebar */}
            {isSidebarVisible && (
                <Sidebar
                    documents={documents}
                    currentDoc={currentDoc}
                    setCurrentDoc={setCurrentDoc}
                    addDocument={() => setOpenDialog(true)}
                    deleteDocument={deleteDocument}
                    renameDocument={(id) => setDocToRename(id)}
                />
            )}

            {/* Main Content */}
            <div className="main-content">
                <div className="toolbar">
                    <IconButton onClick={() => setIsSidebarVisible(!isSidebarVisible)} color="primary">
                        <MenuIcon />
                    </IconButton>
                </div>
                {currentDoc === null ? (
                    <WelcomeScreen
                        onCreateDocument={() => setOpenDialog(true)}
                        username={data ? data.username : ''}
                    />
                ) : (
                    <EditorComponent
                        userData={data}
                        document_data={{
                            id: currentDoc,
                            content: documents.find((doc) => doc._id === currentDoc)?.content || '',
                        }}
                        onUpdateContent={(content) => {
                            setDocuments((prevDocs) =>
                                prevDocs.map((doc) =>
                                    doc._id === currentDoc ? { ...doc, content } : doc
                                )
                            );
                        }}
                    />
                )}
            </div>

            {/* New Document Dialog */}
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>Create New Document</DialogTitle>
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

            {/* Rename Document Dialog */}
            {docToRename !== null && (
                <Dialog open={docToRename !== null} onClose={handleRenameClose}>
                    <DialogTitle>Rename Document</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="New Document Name"
                            fullWidth
                            defaultValue={documents.find((doc) => doc._id === docToRename)?.title || ''}
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
