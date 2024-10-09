import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";

export default function Docs() {
  // Creates a new editor instance.
  const editor = useCreateBlockNote();

  // Define your padding values
  const topPadding = '40px';  // Increased for more space
  const bottomPadding = '40px'; // Increased for more space

  // Define the styles for the editor
  const editorStyle = {
    width: '90%', // Increased width for better visibility
    height: `calc(100vh - ${topPadding} - ${bottomPadding})`, // Fill available height
    margin: '0 auto', // Center the editor horizontally
    paddingTop: topPadding,
    paddingBottom: bottomPadding,
    fontSize: '18px', // Increase font size for better readability
  };

  // Renders the editor instance using a React component.
  return (
    <div style={editorStyle}>
      <BlockNoteView editor={editor} />
    </div>
  );
}
