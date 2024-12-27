import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NoteItem from "../../components/NoteItem";
import ViewFullDetailsModal from "./Modal/ViewFullDetailModal";
import { getNotes } from "../../features/actions/assign";
import { useParams } from "react-router-dom";

const NotesPage = () => {
  const dispatch = useDispatch();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email") || "";
  const { noteData } = useSelector(
    (state) => state.assign
  );
  console.log(noteData);
    const [noteModalData, setNoteModalData] = useState(null);

    useEffect(() => {
      if(email)
      dispatch(getNotes({email}));
    },[])
  return (
    <div className="px-6 md:px-10 pt-14 space-y-6">
      <div className="p-6 bg-gray-50 rounded-lg">
        <div className="flex gap-4 justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-700">Notes</h2>
        </div>
        <div className="grid lg:grid-cols-2 gap-3">
        {Array.isArray(noteData) &&
                  noteData.map((item, index) => (
                    <NoteItem
                      key={index}
                      index={index}
                      item={item}
                      setNoteModalData={setNoteModalData}
                    />
                  ))}

        </div>
      </div>

      {noteModalData && (
        <ViewFullDetailsModal
          modalData={noteModalData}
          setModalData={setNoteModalData}
        />
      )}
    </div>
  );
};

export default NotesPage;
