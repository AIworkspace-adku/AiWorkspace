import React, { useState } from 'react';
import axios from 'axios';
import './Sidebar.css';
import {
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Divider,
    Typography,
    Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UploadFileIcon from '@mui/icons-material/UploadFile';

function Sidebar({ documents, currentDoc, setCurrentDoc, addDocument, deleteDocument }) {
    const [openRenameDialog, setOpenRenameDialog] = useState(false);
    const [renameDocIndex, setRenameDocIndex] = useState(null);
    const [renameDocId, setRenameDocId] = useState(null);
    const [newDocTitle, setNewDocTitle] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const handleRenameDialogOpen = (index, id) => {
        setRenameDocIndex(index);
        setRenameDocId(id);
        setNewDocTitle(documents[index].title);
        setOpenRenameDialog(true);
    };

    const handleRenameDialogClose = () => {
        setOpenRenameDialog(false);
        setRenameDocIndex(null);
        setNewDocTitle('');
    };

    const handleRenameDocument = async () => {
        const updatedDocs = [...documents];
        updatedDocs[renameDocIndex].title = newDocTitle;

        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/renameDocuments/${renameDocId}/${newDocTitle}`);
            setCurrentDoc(renameDocIndex);
        } catch (error) {
            console.error('Error renaming document:', error);
        }
        handleRenameDialogClose();
    };

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
    };

    return (
        <div style={{ width: '300px', backgroundColor: '#1e1e2f', padding: '20px', color: '#eaeaea', height: '100vh' }}>
            <Typography variant="h6" gutterBottom style={{ textAlign: 'center', color: '#fff' }}>
                My Documents
            </Typography>
            <Button
                onClick={addDocument}
                variant="contained"
                fullWidth
                style={{
                    marginBottom: '20px',
                    backgroundColor: '#4caf50',
                    color: '#fff',
                }}
            >
                New Document
            </Button>

            {/* Document List */}
            <List>
                {documents.map((doc, index) => (
                    <Tooltip title="Click to open" key={doc._id}>
                        <ListItem
                            button
                            selected={doc._id === currentDoc}
                            onClick={() => setCurrentDoc(doc._id)}
                            style={{
                                backgroundColor: doc._id === currentDoc ? '#4caf50' : 'transparent',
                                borderRadius: '8px',
                                marginBottom: '8px',
                                transition: 'background-color 0.3s ease',
                            }}
                        >
                            <ListItemText
                                primary={doc.title}
                                style={{
                                    color: doc._id === currentDoc ? '#fff' : '#eaeaea',
                                    fontWeight: doc._id === currentDoc ? 'bold' : 'normal',
                                }}
                            />
                            <ListItemSecondaryAction>
                                <Tooltip title="Rename">
                                    <IconButton
                                        edge="end"
                                        aria-label="rename"
                                        onClick={() => handleRenameDialogOpen(index, doc._id)}
                                    >
                                        <EditIcon style={{ color: '#4caf50' }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => deleteDocument(doc._id)}
                                    >
                                        <DeleteIcon style={{ color: '#f44336' }} />
                                    </IconButton>
                                </Tooltip>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </Tooltip>
                ))}
            </List>

            {/* Divider */}
            <Divider style={{ margin: '20px 0', backgroundColor: '#444' }} />

            {/* Project Docs Section */}
            <Typography variant="h6" gutterBottom style={{ textAlign: 'center', color: '#fff' }}>
                Project Docs
            </Typography>
            <List>
                {uploadedFiles.map((file, index) => (
                    <Tooltip key={index} title={file.name}>
                        <ListItem
                            style={{
                                backgroundColor: '#333',
                                borderRadius: '8px',
                                marginBottom: '8px',
                                color: '#eaeaea',
                                cursor: 'pointer',
                            }}
                        >
                            <ListItemText primary={file.name} />
                        </ListItem>
                    </Tooltip>
                ))}
                <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    id="file-upload"
                />
                <label htmlFor="file-upload">
                    <Button
                        variant="outlined"
                        fullWidth
                        style={{
                            marginTop: '10px',
                            backgroundColor: 'rgba(75, 101, 215, 0.8)',
                            color: '#fff',
                            border: 'none',
                        }}
                        startIcon={<UploadFileIcon />}
                    >
                        Upload PDF
                    </Button>
                </label>
            </List>

            {/* Rename Dialog */}
            <Dialog open={openRenameDialog} onClose={handleRenameDialogClose}>
                <DialogTitle>Rename Document</DialogTitle>
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
                    <Button onClick={handleRenameDialogClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleRenameDocument} color="primary">
                        Rename
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Sidebar;
