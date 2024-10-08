import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import FileExplorer from "./FileExplorer"; // Import your FileExplorer component
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
            data: [
              { type: "file", name: "index.js" },
            ],
          },
          {
            type: "folder",
            name: "public",
            data: [
              { type: "file", name: "index.ts" },
            ],
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
  
export default function Docs() {
  // Creates a new editor instance.
  const editor = useCreateBlockNote();

  // Define padding and layout values
  const topPadding = '90px';  // Increased for more space
  const bottomPadding = '40px'; // Increased for more space

  // Define the layout style for the entire page
  const layoutStyle = {
    display: 'flex',
    width: '100vw',
    height: `calc(100vh - ${topPadding} - ${bottomPadding})`,
    paddingTop: topPadding,
    paddingBottom: bottomPadding,
  };

  // Define the styles for the file explorer
  const fileExplorerStyle = {
    width: '25%', // File explorer takes up 25% of the width
    borderRight: '1px solid #ccc', // Add a subtle border to separate
    padding: '10px',
  };

  // Define the styles for the editor
  const editorStyle = {
    width: '75%', // Editor takes up the remaining 75% of the width
    margin: '0 auto', // Center the editor horizontally
    fontSize: '24px', // Increase font size for better readability
  };

  return (
    <div style={layoutStyle}>
      <div style={fileExplorerStyle}>
      <FileExplorer files={Files} />
      </div>
      <div style={editorStyle}>
        <BlockNoteView editor={editor} />
      </div>
    </div>
  );
}
