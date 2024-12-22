import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Quill from 'quill';
import QuillCursors from 'quill-cursors';

// Correctly register the quill-cursors module
Quill.register('modules/cursors', QuillCursors);

function SimpleEditor() {
    const quillRef = useRef(null);

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'image']
        ],
        cursors: true,
    };

    useEffect(() => {
        const quill = quillRef.current.getEditor();
        const cursors = quill.getModule('cursors');
        console.log('Quill Editor:', quill);
        console.log('Cursors Module:', cursors);

        // Example cursor setup
        cursors.createCursor('user1', 'User 1', 'blue');
        cursors.moveCursor('user1', { index: 5, length: 0 });
    }, []);

    return (
        <div>
            <ReactQuill
                ref={quillRef}
                theme="snow"
                modules={quillModules}
            />
        </div>
    );
}

export default SimpleEditor;