// src/components/Sidebar.js
import React, { useState } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function Sidebar({ documents, currentDoc, setCurrentDoc, addDocument, deleteDocument }) {
    const [openRenameDialog, setOpenRenameDialog] = useState(false);
    const [renameDocIndex, setRenameDocIndex] = useState(null);
    const [renameDocId, setRenameDocId] = useState(null);
    const [newDocTitle, setNewDocTitle] = useState('');
    console.log(documents);

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

    const handleRenameDocument = () => {
        const updatedDocs = [...documents];
        updatedDocs[renameDocIndex].title = newDocTitle;
        try {
			axios.post(`http://localhost:5000/renameDocuments/${renameDocId}/${newDocTitle}`);
		} catch (error) {
			console.error('Error renaming document:', error);
		}
        setCurrentDoc(renameDocIndex);
        handleRenameDialogClose();
    };

    return (
        <div style={{ width: '250px', backgroundColor: '#f0f0f0', padding: '10px' }}>
            <Button
                onClick={addDocument}
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginBottom: '20px' }}
            >
                New Document
            </Button>
            <List>
                {documents && documents.map((doc, index) => (
                    <ListItem
                        key={index}
                        button
                        selected={index === currentDoc}
                        onClick={() => setCurrentDoc(doc._id)}
                    >
                        <ListItemText primary={doc.title} />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="rename" onClick={() => handleRenameDialogOpen(index, doc._id)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton edge="end" aria-label="delete" onClick={() => deleteDocument(doc._id)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>

            {/* Dialog for Renaming Document */}
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
