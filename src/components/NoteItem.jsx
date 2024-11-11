import React from 'react'
import { formatDate } from '../utils/extra';

const NoteItem = (props) => {
    const { item, index, setNoteModalData } = props;
  
    return (
      <div
        className="border-b-2 bg-white hover:bg-gray-100 relative cursor-pointer transition duration-300 text-black"
        onClick={() => setNoteModalData(item)}
      >
        <div className="flex pl-4 pr-2 pt-2 justify-between">
          <div className="text-xs font-semibold">Note {index + 1} :</div>
          <div className="flex gap-2">
            <p className="text-xs">
              Date :
              <span className="rounded-md px-2">
                {formatDate(item?.updatedAt)}
              </span>
            </p>
            <p className="text-xs">
              Call Duration:
              <span className="rounded-md px-2">
                {`${item?.callDuration?.hr}-${item?.callDuration?.min}-${item?.callDuration?.sec}`}
              </span>
            </p>
          </div>
        </div>
        <div className="flex pt-3 px-3">
          <p className="text-sm rounded-md px-2 py-2 bg-slate-100">
            {item?.note}
          </p>
        </div>
      </div>
    );
  };
  

export default NoteItem