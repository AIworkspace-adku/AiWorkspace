import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import { io } from 'socket.io-client';
import EditorToolbar from './EditorToolbar.js';
import 'react-quill/dist/quill.snow.css';
import './EditorComponent.css';
import Quill from 'quill';
import QuillCursors from 'quill-cursors';

Quill.register('modules/cursors', QuillCursors);
const socket = io(`${process.env.REACT_APP_BACKEND_URL}`);

function EditorComponent({ userData, document_data, onUpdateContent }) {
    const quillRef = useRef(null);
    const resizeObserverRef = useRef(null);
    const [editorSize, setEditorSize] = useState('normal');
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [previousQueries, setPreviousQueries] = useState([]);
    const [currentQueryIndex, setCurrentQueryIndex] = useState(-1);
    const [queryResult, setQueryResult] = useState('');
    const [lastModified, setLastModified] = useState(null);
    const [lastEditor, setLastEditor] = useState([]);

    const handleDownload = () => {
        const quill = quillRef.current.getEditor();
        const content = quill.getContents();
        const blob = new Blob([JSON.stringify(content)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${document_data.id}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };
    const quillModules = {
        toolbar: {
            container: '#toolbar'
        },
        cursors: {
            transformOnTextChange: true,
        },
    };

    // Safe resize observer creation
    const createSafeResizeObserver = (callback) => {
        return new ResizeObserver((entries) => {
            window.requestAnimationFrame(() => {
                if (document.body.contains(entries[0].target)) {
                    callback(entries);
                }
            });
        });
    };

    // Setup resize observer
    useEffect(() => {
        const editorContainer = document.querySelector('.editor-container');
        if (!editorContainer) return;

        const handleResize = (entries) => {
            const quill = quillRef.current?.getEditor();
            if (quill) {
                quill.update('silent');
            }
        };

        resizeObserverRef.current = createSafeResizeObserver(handleResize);
        resizeObserverRef.current.observe(editorContainer);

        return () => {
            if (resizeObserverRef.current) {
                resizeObserverRef.current.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        const fetchDocument = async () => {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getDocument/${document_data.id}`);
            if (response.ok) {
                const data = await response.json();
                const quill = quillRef.current.getEditor();
                quill.setContents(data.content); // Load Delta content into Quill
            } else {
                console.error('Failed to fetch document_data');
            }
        };

        fetchDocument();
    }, [document_data.id]);

    useEffect(() => {

        const quill = quillRef.current.getEditor(); // Access the Quill editor instance

        const saveDocument = async () => {
            const quill = quillRef.current.getEditor();
            const delta = quill.getContents();

            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/saveDocument`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        documentId: document_data.id,
                        content: delta,
                        user: userData.username,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setLastModified(data.document.lastModified);
                    setLastEditor(data.document.lastEditedBy.user);
                } else {
                    console.error('Failed to save document');
                }
            } catch (error) {
                console.error('Error saving document:', error);
            }
        };

        const interval = setInterval(() => {
            saveDocument();
        }, 5000); // Save every 5 seconds

        return () => clearInterval(interval);
    }, [document_data.id]);

    useEffect(() => {
        const quill = quillRef.current.getEditor();
        const cursors = quill.getModule('cursors');
        console.log('Quill Editor:', quill);
        console.log('Cursors Module:', quill.getModule('cursors'));

        // Join the document_data room
        socket.emit('join-document', document_data.id);

        // Listen for updates from the server
        socket.on('document-update', (delta) => {
            const currentDelta = quill.getContents(); // Get current content

            requestAnimationFrame(() => {
                quill.updateContents(delta);
            });
        });

        socket.on('cursor-update', ({ userId, range, color, name }) => {
            if (userId !== socket.id) {
                requestAnimationFrame(() => {
                    cursors.createCursor(userId, name, color);
                    cursors.moveCursor(userId, range);
                });
            }
        });

        // Handle local text changes
        const handleTextChange = (delta, oldDelta, source) => {
            if (source === 'user') {
                const range = quill.getSelection();
                if (range) {
                    const textBeforeCursor = quill.getText(0, range.index); // Text before the cursor
                    const lastChar = textBeforeCursor.slice(-1);

                    if (lastChar === '/') {
                        if (!isDropdownOpen) {
                            setDropdownOpen(true); // Open the dropdown if `/` is typed
                        }
                    } else if (isDropdownOpen) {
                        setDropdownOpen(false); // Close the dropdown if `/` is removed
                    }
                }
                socket.emit('document-change', { _id: document_data.id, delta }); // Send the delta to the server
            }
        };

        const handleSelectionChange = (range) => {
            if (range) {
                const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
                socket.emit('cursor-move', {
                    documentId: document_data.id,
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
            socket.emit('leave-document', document_data.id); // Leave the room
            socket.off('document-update'); // Remove server listener
            socket.off('cursor-update');
            quill.off('text-change', handleTextChange); // Remove local listener
            quill.off('selection-change', handleSelectionChange);
        };
    }, [document_data.id]);

    useEffect(() => {
        const handleKeydown = (e) => {
            if (e.key === 'Escape' && isDropdownOpen) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeydown);

        return () => {
            document.removeEventListener('keydown', handleKeydown);
        };
    }, [isDropdownOpen]);

    const insertResponse = () => {
        const quill = quillRef.current.getEditor();

        if (queryResult) {
            // Insert the response as plain text at the current cursor position
            const range = quill.getSelection(); // Get the current cursor position
            if (range) {
                quill.insertText(range.index, queryResult); // Insert text at the cursor position
            } else {
                // If no selection, insert at the end of the document
                quill.insertText(quill.getLength() - 1, queryResult);
            }
        } else {
            console.log("No query result to insert.");
        }
    }

    const handleQuerySubmit = async () => {
        if (!query.trim()) return;

        setPreviousQueries((prev) => [...prev, query]);
        setCurrentQueryIndex(-1);

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/gemini-query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });
            const result = await response.json();
            setQueryResult(result.suggestions || 'No response received.');
        } catch (error) {
            console.error('Error querying Gemini:', error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowUp') {
            // Navigate to the previous query
            if (currentQueryIndex < previousQueries.length - 1) {
                const newIndex = currentQueryIndex + 1;
                setCurrentQueryIndex(newIndex);
                setQuery(previousQueries[previousQueries.length - 1 - newIndex]);
            }
        } else if (e.key === 'ArrowDown') {
            // Navigate to the next query
            if (currentQueryIndex > 0) {
                const newIndex = currentQueryIndex - 1;
                setCurrentQueryIndex(newIndex);
                setQuery(previousQueries[previousQueries.length - 1 - newIndex]);
            } else if (currentQueryIndex === 0) {
                setCurrentQueryIndex(-1);
                setQuery('');
            }
        }
    };

    const handleSizeChange = (e) => {
        setEditorSize(e.target.value);
    };

    const getEditorStyle = () => {
        const styles = {
            small: { height: '300px' },
            normal: { height: '500px' },
            large: { height: '700px' },
            full: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }
        };
        return styles[editorSize] || styles.normal;
    };

    return (
        <div className={`editor-container ${editorSize === 'full' ? 'full-screen' : ''}`} style={getEditorStyle()}>
            <EditorToolbar onSizeChange={setEditorSize} />

            <div className="document-info">
                <p>Last Edited By: <strong>{lastEditor}</strong></p>
                <p>Last Modified: <strong>{new Date(lastModified).toLocaleString()}</strong></p>
                <button onClick={handleDownload}>Download</button>
            </div>

            <ReactQuill ref={quillRef} theme="snow" modules={quillModules} />
            {isDropdownOpen && (
                <div className="ai-query-popup">
                    <input
                        type="text"
                        className="query-input"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your query"
                    />
                    <button className='ai-query-popup-button' onClick={handleQuerySubmit}>Query</button>
                    <textarea
                        className="query-result"
                        readOnly
                        value={queryResult}
                        placeholder="Response will appear here"
                    />
                    <button className='ai-query-popup-button' onClick={insertResponse}>Insert in document</button>
                </div>
            )}
        </div>
    );
}

export default EditorComponent;