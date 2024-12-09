import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { EditorProvider, useCurrentEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import ListItem from "@tiptap/extension-list-item";
import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";

import "./tiptap.css"; // TipTap custom styles
import {
  getNoticeBoard,
  updateNoticeBoard,
} from "../../features/actions/noticeBoard";
import { useDispatch, useSelector } from "react-redux";
import { resetSuccessAndUpdate } from "../../features/slices/noticeBoard";
import { useNavigate } from "react-router-dom";

const MenuBar = ({ setEditorContent }) => {
  const { editor } = useCurrentEditor();
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  if (!editor) return null;

  const handleAddLink = () => {
    editor.chain().focus().setLink({ href: linkUrl }).run();
    setLinkDialogOpen(false);
    setLinkUrl("");
  };

  const colors = ["#ff0000", "#00ff00", "#0000ff", "#ff9900", "#800080"];

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        <Button
          variant="contained"
          size="small"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-blue-500" : ""}
        >
          Bold
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-blue-500" : ""}
        >
          Italic
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 }) ? "bg-blue-500" : ""
          }
        >
          H1
        </Button>
        {colors.map((color) => (
          <Button
            key={color}
            variant="contained"
            size="small"
            onClick={() => editor.chain().focus().setColor(color).run()}
            className={
              editor.isActive("textStyle", { color }) ? "opacity-80" : ""
            }
            style={{ backgroundColor: color }}
          >
            &nbsp;
          </Button>
        ))}
        <Button
          variant="contained"
          size="small"
          onClick={() => setLinkDialogOpen(true)}
        >
          Add Link
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={() => editor.chain().focus().unsetLink().run()}
        >
          Remove Link
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={() => editor.chain().focus().undo().run()}
        >
          Undo
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={() => editor.chain().focus().redo().run()}
        >
          Redo
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-blue-500" : ""}
        >
          Bullet List
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-blue-500" : ""}
        >
          Ordered List
        </Button>
      </div>
      <Dialog open={linkDialogOpen} onClose={() => setLinkDialogOpen(false)}>
        <DialogTitle>Add a Hyperlink</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="URL"
            type="url"
            fullWidth
            variant="outlined"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLinkDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddLink}>Add Link</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
    },
    orderedList: {
      keepMarks: true,
    },
  }),
  Link.configure({
    openOnClick: false, // Prevent opening links while editing
  }),
];

const content = `
<h2>Welcome to the Noticeboard Editor</h2>
<p>Edit your notice content here. Add styles like <strong>bold</strong>, <em>italic</em>, or even <u>underline</u>.</p>
`;

const UpdateNoticeboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { noticeData, isSuccess } = useSelector((state) => state.noticeBoard);

  const [editorContent, setEditorContent] = useState(
    noticeData?.content || content
  );

  useEffect(() => {
    dispatch(getNoticeBoard());
  }, []);

  useEffect(() => {
    if (isSuccess) {
      navigate("/notice-board");
    }
    return () => {
      dispatch(resetSuccessAndUpdate());
    };
  }, [isSuccess]);
  return (
    <Box className="flex flex-col items-center px-6 pt-14 bg-gray-100 min-h-screen">
      <Paper
        elevation={3}
        className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md"
      >
        <Typography variant="h4" className="text-center mb-6 font-bold">
          Update Noticeboard
        </Typography>
        <div className="mb-6 border rounded-lg p-4">
          <EditorProvider
            slotBefore={<MenuBar setEditorContent={setEditorContent} />}
            extensions={extensions}
            content={editorContent}
            onUpdate={({ editor }) => setEditorContent(editor.getHTML())}
          >
            <EditorContent />
          </EditorProvider>
        </div>
        <div className="mt-6 text-right">
          <Button
            variant="contained"
            color="primary"
            className="px-6 py-2 font-bold"
            onClick={() =>
              dispatch(
                updateNoticeBoard({ content: editorContent, type: "sales" })
              )
            }
          >
            Update Noticeboard
          </Button>
        </div>
      </Paper>
     
    </Box>
  );
};

export default UpdateNoticeboard;
