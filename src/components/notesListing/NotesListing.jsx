/* eslint-disable react/prop-types */
import noGroupSelectedImg from "../../images/noGroupSelected.svg";
import "./notesListing.css";
import sendMessageIcon from "./sendMessageIcon.svg";
import { useState, useRef } from "react";
import backArrow from "./back-arrrow.svg";
import lock from "../../images/lock.png";

export default function NotesListing(props) {
  let seletedGroupObj = props.all_groups.find(
    (grp) => grp.id === props.selectedGroup
  );
  let noteRef = useRef("");

  let allCurrentNotes = JSON.parse(localStorage.getItem("notes")) || {};
  let [allNotes, setAllNotes] = useState(allCurrentNotes);
  let [editNoteId, setEditNoteId] = useState(null);
  let [editedNoteValue, setEditedNoteValue] = useState("");

  const handleDeleteNote = (dateTime) => {
    const updatedNotes = { ...allNotes };
    updatedNotes[seletedGroupObj.id] = updatedNotes[seletedGroupObj.id].filter(
      (note) => note.dateTime !== dateTime
    );
    setAllNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  const handleEditNote = (dateTime, editedNote) => {
    const updatedNotes = { ...allNotes };
    const index = updatedNotes[seletedGroupObj.id].findIndex(
      (note) => note.dateTime === dateTime
    );
    updatedNotes[seletedGroupObj.id][index].note = editedNote;
    setAllNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    setEditNoteId(null);
  };

  const saveNote = () => {
    if (noteRef.current.value.trim() === "") {
      return;
    }

    let note = {
      dateTime: new Date().toString(),
      note: noteRef.current.value,
    };

    noteRef.current.value = "";

    if (Object.keys(allCurrentNotes).includes(seletedGroupObj.id)) {
      allCurrentNotes[seletedGroupObj.id].push(note);
    } else {
      allCurrentNotes = { ...allCurrentNotes, [seletedGroupObj.id]: [note] };
    }
    setAllNotes(allCurrentNotes);
    localStorage.setItem("notes", JSON.stringify(allCurrentNotes));
  };

  const confirmEdit = (dateTime) => {
    if (editedNoteValue.trim() === "") {
      return;
    }
    handleEditNote(dateTime, editedNoteValue);
    setEditedNoteValue("");
  };

  return (
    <section className="noteSection">
      {!props.selectedGroup ? (
        <div className="noGroupSelectedSection">
          <div className="messageWrapper">
            <img
              style={{ width: "100%" }}
              src={noGroupSelectedImg}
              alt="No group selected"
            ></img>
            <h1 className="pocketNotesHeading">Pocket Notes</h1>
            <p>
              Send and receive messages without keeping your phone online.
              <br />
              Use Pocket Notes on up to 4 linked devices and 1 mobile phone
            </p>
          </div>
          <div className="encryptionMsg">
            <img src={lock} alt="" />
            end-to-end encrypted
          </div>
        </div>
      ) : (
        <div className="NotesListingInnerWrapper">
          <div className="notesIconBar">
            {!props.isDesktop && (
              <div
                className="backIconWrapper"
                onClick={() => props.setSelectedGroup((selected) => !selected)}
              >
                <img src={backArrow} alt="Back" />
              </div>
            )}
            <div
              style={{ background: seletedGroupObj.color }}
              className="navGroupIcon"
            >
              {seletedGroupObj.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="navGroupName">{seletedGroupObj.name}</div>
          </div>

          <div className="notesListing">
            {Object.keys(allNotes).includes(seletedGroupObj.id) &&
              allNotes[seletedGroupObj.id].map((note) => (
                <div className="noteBlock" key={note.dateTime}>
                  {editNoteId !== note.dateTime ? (
                    <div>
                      <div className="note">{note.note}</div>
                      <div className="dateTime">
                        <p>
                          {new Date(note.dateTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {" • "}
                          {new Date(note.dateTime).toLocaleString("en-US", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <button
                        className="editButton"
                        onClick={() => {
                          setEditNoteId(note.dateTime);
                          setEditedNoteValue(note.note);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="deleteButton"
                        onClick={() => handleDeleteNote(note.dateTime)}
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <div>
                      <textarea
                        value={editedNoteValue}
                        onChange={(e) => setEditedNoteValue(e.target.value)}
                        className="editNoteArea"
                        placeholder="Edit your note here..."
                        style={{
                          resize: "none",
                          width: "60vw",
                          height: "20vh",
                        }}
                      ></textarea>
                      <button
                        className="saveEditButton"
                        onClick={() => confirmEdit(note.dateTime)}
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </div>

          <div className="notesInputWrapper">
            <textarea
              ref={noteRef}
              className="notesInputArea"
              placeholder="Enter Your Text Here..."
            ></textarea>
            <img
              onClick={saveNote}
              className="sendMessageIcon"
              src={sendMessageIcon}
              alt="Send Message"
            />
          </div>
        </div>
      )}
    </section>
  );
}
