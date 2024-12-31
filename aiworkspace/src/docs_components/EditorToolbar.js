// src/components/EditorToolbar.js

import React from 'react';
import './EditorToolbar.css'
const EditorToolbar = ({ onSizeChange, onAddMember }) => (
	<div id="toolbar">
		<span className="ql-formats">
			<select className="ql-font" defaultValue="arial">
				<option value="arial">Arial</option>
				<option value="comic-sans">Comic Sans</option>
				<option value="courier-new">Courier New</option>
				<option value="georgia">Georgia</option>
				<option value="helvetica">Helvetica</option>
				<option value="lucida">Lucida</option>
			</select>
			<select className="ql-size" defaultValue="medium">
				<option value="extra-small">Size 1</option>
				<option value="small">Size 2</option>
				<option value="medium">Size 3</option>
				<option value="large">Size 4</option>
			</select>
			<select className="ql-header" defaultValue="3">
				<option value="1">Heading</option>
				<option value="2">Subheading</option>
				<option value="3">Normal</option>
			</select>
		</span>
		<span className="ql-formats">
			<button className="ql-bold" />
			<button className="ql-italic" />
			<button className="ql-underline" />
			<button className="ql-strike" />
		</span>
		<span className="ql-formats">
			<button className="ql-list" value="ordered" />
			<button className="ql-list" value="bullet" />
			<button className="ql-indent" value="-1" />
			<button className="ql-indent" value="+1" />
		</span>
		<span className="ql-formats">
			<button className="ql-script" value="super" />
			<button className="ql-script" value="sub" />
			<button className="ql-blockquote" />
			<button className="ql-direction" />
		</span>
		<span className="ql-formats">
			<select className="ql-align" />
			<select className="ql-color" />
			<select className="ql-background" />
		</span>
		<span className="ql-formats">
			<button className="ql-link" />
			<button className="ql-image" />
			<button className="ql-video" />
		</span>
		<span className="ql-formats">
			<button className="ql-formula" />
			<button className="ql-code-block" />
			<button className="ql-clean" />
		</span>
		<span className="ql-formats">
			<select onChange={onSizeChange} defaultValue="normal">
				<option value="small">Small Editor</option>
				<option value="normal">Normal Editor</option>
				<option value="large">Large Editor</option>
				<option value="full">Full Screen</option>
			</select>
		</span>
		<span className="ql-formats" style={{ position: 'absolute', right: '10px', top: '5px' }}>
			<button className="add-member-btn" onClick={() => onAddMember(true)}>Add Member</button>
		</span>
	</div>
);

export default EditorToolbar;