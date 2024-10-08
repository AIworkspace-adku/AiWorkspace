// FileExplorer.js
import React, { useState } from "react";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
const Files = {
    type: "folder",
    name: "parent",
    data: [
      {
        type: "folder",
        name: "root",
        data: [
          {
            type: "folder",
            name: "src",
            data: [{ type: "file", name: "index.js" }],
          },
          {
            type: "folder",
            name: "public",
            data: [{ type: "file", name: "index.ts" }],
          },
          { type: "file", name: "index.html" },
          {
            type: "folder",
            name: "data",
            data: [
              {
                type: "folder",
                name: "images",
                data: [
                  { type: "file", name: "image.png" },
                  { type: "file", name: "image2.webp" },
                ],
              },
              { type: "file", name: "logo.svg" },
            ],
          },
          { type: "file", name: "style.css" },
        ],
      },
    ],
  };
  
function FileExplorer({ files, onCreate, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  const handleCreate = (type) => {
    onCreate(files.name, type);
  };

  const handleDelete = () => {
    onDelete(files.name);
  };

  if (files.type === "folder") {
    return (
      <div key={files.name}>
        <ContextMenuTrigger id={files.name}>
          <span onClick={() => setExpanded(!expanded)}>
            {files.name} 📂
          </span>
        </ContextMenuTrigger>
        <div
          className="expanded"
          style={{ display: expanded ? "block" : "none" }}
        >
          {files.data &&
            files.data.map((file) => (
              <FileExplorer
                key={file.name}
                files={file}
                onCreate={onCreate}
                onDelete={onDelete}
              />
            ))}
        </div>
        <ContextMenu id={files.name}>
          <MenuItem onClick={() => handleCreate("folder")}>New Folder</MenuItem>
          <MenuItem onClick={() => handleCreate("file")}>New File</MenuItem>
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        </ContextMenu>
      </div>
    );
  } else if (files.type === "file") {
    return (
      <div>
        <ContextMenuTrigger id={files.name}>
          {files.name}
        </ContextMenuTrigger>
        <ContextMenu id={files.name}>
          <MenuItem onClick={() => handleDelete()}>Delete</MenuItem>
        </ContextMenu>
      </div>
    );
  }

  return null;
}

export default function App() {
  const [files, setFiles] = useState(Files);

  const createEntity = (parentName, type) => {
    const newEntity = {
      type: type,
      name: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
    };
    
    const addEntity = (data) => {
      if (data.name === parentName) {
        data.data = data.data || [];
        data.data.push(newEntity);
      } else if (data.data) {
        data.data.forEach(addEntity);
      }
    };

    setFiles((prevFiles) => {
      const updatedFiles = { ...prevFiles };
      addEntity(updatedFiles);
      return updatedFiles;
    });
  };

  const deleteEntity = (name) => {
    const removeEntity = (data) => {
      if (data.data) {
        data.data = data.data.filter((file) => file.name !== name);
        data.data.forEach(removeEntity);
      }
    };

    setFiles((prevFiles) => {
      const updatedFiles = { ...prevFiles };
      removeEntity(updatedFiles);
      return updatedFiles;
    });
  };

  return (
    <div className="App">
      <FileExplorer files={files} onCreate={createEntity} onDelete={deleteEntity} />
    </div>
  );
}
