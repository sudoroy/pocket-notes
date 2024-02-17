import { useState, useRef, useEffect } from "react";
import "./App.css";
import GroupsSection from "./components/groups/GroupsSection";
import NotesListing from "./components/notesListing/NotesListing";

let all_groups = JSON.parse(localStorage.getItem("groups"));
if (all_groups == undefined) {
  all_groups = [];
}

// define function to get next group or notes id
function getNextGroupOrNotesId(prefix) {
  let count = all_groups.length + 1;
  return function () {
    return prefix + count++;
  };
}
let nextGroupIDgenerator = getNextGroupOrNotesId("gp");

function App() {
  const [isDesktop, setDesktop] = useState(window.innerWidth > 650);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groups, setGroups] = useState([]);
  const [showCreateGroupForm, setShowCreateGroupForm] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const colorOptions = [
    "#B38BFA",
    "#FF79F2",
    "#43E6FC",
    "#F19576",
    "#0047FF",
    "#6691FF",
  ];

  const groupNameRef = useRef(null);
  const createGroupFormRef = useRef(null);

  const handleOutsideClick = (event) => {
    if (
      createGroupFormRef.current &&
      !createGroupFormRef.current.contains(event.target)
    ) {
      setShowCreateGroupForm(false);
    }
  };

  useEffect(() => {
    const updateMedia = () => {
      setDesktop(window.innerWidth > 650);
    };
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const addGroup = () => {
    // validate input
    if (!groupNameRef.current.value.trim() || !selectedColor) {
      return;
    }
    // add the group
    all_groups.push({
      id: nextGroupIDgenerator(),
      name: groupNameRef.current.value,
      color: selectedColor,
    });
    setShowCreateGroupForm(false);
    localStorage.setItem("groups", JSON.stringify(all_groups));
  };

  return (
    <>
      {isDesktop ? (
        <>
          <div className="groupSectionWrapper">
            <GroupsSection
              setShowCreateGroupForm={setShowCreateGroupForm}
              setGroups={setGroups}
              all_groups={all_groups}
              setSelectedGroup={setSelectedGroup}
              selectedGroup={selectedGroup}
            />
          </div>
          <div className="notesListingWrapper">
            <NotesListing
              isDesktop={isDesktop}
              selectedGroup={selectedGroup}
              setSelectedGroup={setSelectedGroup}
              all_groups={all_groups}
            />
          </div>
        </>
      ) : selectedGroup ? (
        <NotesListing
          isDesktop={isDesktop}
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
          all_groups={all_groups}
        />
      ) : (
        <GroupsSection
          setShowCreateGroupForm={setShowCreateGroupForm}
          setGroups={setGroups}
          all_groups={all_groups}
          setSelectedGroup={setSelectedGroup}
          selectedGroup={selectedGroup}
        />
      )}
      {showCreateGroupForm && (
        <div className="createNewGroupSection">
          <div ref={createGroupFormRef} className="createGroupForm">
            <h2>Create New Notes Group</h2>
            <div className="createGroupInputWrapper">
              <span className="createGroupInputs">
                <label className="groupNameLabel">Group Name</label>
                <input
                  ref={groupNameRef}
                  className="groupNameInput"
                  placeholder="Enter Your Group Name..."
                  type="text"
                />
              </span>
              <span className="createGroupInputs">
                <label className="chooseColourLabel">Choose Colour</label>
                <div className="colorOptionsWrapper">
                  {colorOptions.map((colorCode) => (
                    <span
                      key={colorCode}
                      onClick={() => {
                        setSelectedColor(colorCode);
                      }}
                      style={{
                        background: colorCode,
                        border:
                          selectedColor === colorCode
                            ? "solid 3px grey"
                            : "none",
                      }}
                      className="colorOption"
                    ></span>
                  ))}
                </div>
              </span>
            </div>
            <div className="createGroupBtnWrapper">
              <button onClick={addGroup} className="createGroupFormBtn">
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
