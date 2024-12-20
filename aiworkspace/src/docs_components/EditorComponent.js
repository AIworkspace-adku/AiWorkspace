import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import { io } from 'socket.io-client';
import EditorToolbar from './EditorToolbar';
import 'react-quill/dist/quill.snow.css';
import './EditorComponent.css';
import Quill from 'quill';
import QuillCursors from 'quill-cursors';

Quill.register('modules/cursors', QuillCursors);
const socket = io('http://localhost:5000');

function EditorComponent({ userData, document, onUpdateContent }) {
    const quillRef = useRef(null);
    const [editorSize, setEditorSize] = useState('normal');
    const [showAddMemberPopup, setShowAddMemberPopup] = useState(false);
    const [newMemberEmail, setNewMemberEmail] = useState('');

    const quillModules = {
        toolbar: {
            container: '#toolbar'
        },
        cursors: {
            transformOnTextChange: true,
        },
    };

    useEffect(() => {
        const fetchDocument = async () => {
            const response = await fetch(`http://localhost:5000/getDocument/${document.id}`);
            if (response.ok) {
                const data = await response.json();
                const quill = quillRef.current.getEditor();
                quill.setContents(data.content); // Load Delta content into Quill
            } else {
                console.error('Failed to fetch document');
            }
        };

        fetchDocument();
    }, [document.id]);

    useEffect(() => {

        const quill = quillRef.current.getEditor(); // Access the Quill editor instance

        const saveDocument = async () => {
            const delta = quill.getContents(); // Get the Delta object
            const response = await fetch('http://localhost:5000/saveDocument', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    documentId: document.id,
                    content: delta, // Pass Delta to the backend
                }),
            });

            if (response.ok) {
                console.log('Document saved successfully');
            } else {
                console.error('Failed to save document');
            }
        };

        const interval = setInterval(() => {
            saveDocument();
        }, 5000); // Save every 5 seconds

        return () => clearInterval(interval);
    }, [document.id]);

    useEffect(() => {
        const quill = quillRef.current.getEditor();
        const cursors = quill.getModule('cursors');
        console.log('Quill Editor:', quill);
        console.log('Cursors Module:', quill.getModule('cursors'));

        // Join the document room
        socket.emit('join-document', document.id);

        // Listen for updates from the server
        socket.on('document-update', (delta) => {
            const currentDelta = quill.getContents(); // Get current content

            // Apply the received delta
            quill.updateContents(delta);
        });

        socket.on('cursor-update', ({ userId, range, color, name }) => {
            if (userId !== socket.id) {
                cursors.createCursor(userId, name, color);
                cursors.moveCursor(userId, range);
            }
        });

        // Handle local text changes
        const handleTextChange = (delta, oldDelta, source) => {
            if (source === 'user') {
                socket.emit('document-change', { _id: document.id, delta }); // Send the delta to the server
            }
        };

        const handleSelectionChange = (range) => {
            if (range) {
                const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
                socket.emit('cursor-move', {
                    documentId: document.id,
                    range,
                    color,
                    name: userData?.username || 'Anonymous', // Replace with actual user's name
                });
            }
        };

        quill.on('text-change', handleTextChange);
        quill.on('selection-change', handleSelectionChange);

        // Cleanup on component unmount
        return () => {
            socket.emit('leave-document', document.id); // Leave the room
            socket.off('document-update'); // Remove server listener
            quill.on('selection-change', handleSelectionChange);
            quill.off('text-change', handleTextChange); // Remove local listener
            quill.off('selection-change', handleSelectionChange);
        };
    }, [document.id]);


    const handleSizeChange = (e) => {
        setEditorSize(e.target.value);
    };

    const handleAddMember = async () => {
        setShowAddMemberPopup(false); // Close the popup

        if (!newMemberEmail) return;

        try {
            const response = await fetch('http://localhost:5000/addMember', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    documentId: document.id,
                    memberEmail: newMemberEmail,
                }),
            });

            if (response.ok) {
                alert('Member added successfully!');
            } else {
                alert('Failed to add member.');
            }
        } catch (error) {
            console.error('Error adding member:', error);
        }
    };

    const getEditorStyle = () => {
        switch (editorSize) {
            case 'small':
                return { height: '300px' };
            case 'normal':
                return { height: '500px' };
            case 'large':
                return { height: '700px' };
            case 'full':
                return { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 };
            default:
                return {};
        }
    };

    return (
        <div className={`editor-container ${editorSize === 'full' ? 'full-screen' : ''}`} style={getEditorStyle()}>
            <EditorToolbar onSizeChange={handleSizeChange} onAddMember={setShowAddMemberPopup} />
            <ReactQuill
                ref={quillRef}
                theme="snow"
                modules={quillModules}
            />
            {showAddMemberPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h3>Add Member</h3>
                        <input
                            type="email"
                            placeholder="Enter email"
                            value={newMemberEmail}
                            onChange={(e) => setNewMemberEmail(e.target.value)}
                        />
                        <button onClick={handleAddMember}>Add</button>
                        <button onClick={() => setShowAddMemberPopup(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EditorComponent;
