// src/components/EditorComponent.js

import React, { useRef, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import EditorToolbar from './EditorToolbar';
import io from 'socket.io-client';
import 'react-quill/dist/quill.snow.css';

function EditorComponent({ document, onUpdateContent }) {
    const quillRef = useRef(null);
    const socketRef = useRef(null);
    const [editorSize, setEditorSize] = useState('normal');

    const quillModules = {
        toolbar: {
            container: '#toolbar',
        },
    };

    useEffect(() => {
        // Initialize the socket only once
        if (!socketRef.current) {
            socketRef.current = io('http://localhost:5000'); // Replace with your server URL
    
            socketRef.current.on('connect', () => {
                console.log('Connected to server');
            });
    
            // Listen for document updates from the server
            socketRef.current.on('document-update', (updatedContent) => {
                if (quillRef.current) {
                    const quill = quillRef.current.getEditor();
                    quill.setContents(updatedContent); // Apply Delta from the server
                }
            });
        }
    
        // Leave the previous room and join the new one when the document ID changes
        if (socketRef.current) {
            console.log('Switching to document:', document.id);
    
            // Leave the previous room if one exists
            if (socketRef.current.currentRoom) {
                socketRef.current.emit('leave-document', socketRef.current.currentRoom);
                console.log('Left previous room:', socketRef.current.currentRoom);
            }
    
            // Join the new room
            socketRef.current.emit('join-document', document.id);
            socketRef.current.currentRoom = document.id; // Track the current room
        }
    
        // Cleanup (optional for when switching between documents quickly)
        return () => {
            // Leave the current room (but keep the socket connection open)
            if (socketRef.current && socketRef.current.currentRoom) {
                socketRef.current.emit('leave-document', socketRef.current.currentRoom);
                console.log('Leaving room:', socketRef.current.currentRoom);
            }
        };
    }, [document.id]);

    useEffect(() => {
        if (quillRef.current && quillRef.current.getEditor()) {
            const quill = quillRef.current.getEditor();

            // Handle text changes
            quill.on('text-change', (delta, oldDelta, source) => {
                if (source === 'user') {
                    const currentDelta = quill.getContents(); // Get the current Delta
                    socketRef.current.emit('document-change', {
                        _id: document.id,
                        delta: delta, // Send only the change Delta
                        content: currentDelta, // Send the updated document
                    });

                    onUpdateContent(currentDelta); // Pass Delta to parent
                }
            });
        }
    }, [document.id, onUpdateContent]);

    const handleSizeChange = (e) => {
        setEditorSize(e.target.value);
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
            <EditorToolbar onSizeChange={handleSizeChange} />
            <ReactQuill
                ref={quillRef}
                theme="snow"
                modules={quillModules}
                value={document.content}
                onChange={(content) => { }} // We're handling changes in the text-change event
            />
        </div>
    );
}

export default EditorComponent;