import React from "react";
import { 
  HiCheck, 
  HiPencilAlt, 
  HiOutlineTrash, 
  HiOutlineReply,
  HiOutlineArchive,
  HiOutlineDotsHorizontal 
} from "react-icons/hi";
import "./OverflowMenu.css";

function OverflowMenu({ todoItem, onSelectedOption }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef(null);
  
  const toggleIsOpen = () => {
    setIsOpen(prev => !prev);
  };

  const handleOption = (option) => {
    onSelectedOption(option);
    setIsOpen(false);
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="overflowMenu-container" ref={menuRef}>
      <button
        className="overflowMenu-button"
        onClick={toggleIsOpen}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <HiOutlineDotsHorizontal />
      </button>

      {isOpen && (
        <div className="overflowMenu-menu" role="menu">
          {
            (!todoItem.isCompleted && todoItem.status !== "archived") && (
              <>
                <span
                  onClick={() => { handleOption("complete"); }}
                  className="overflowMenu-option complete"
                  role="menuitem"
                  tabIndex={0}
                >
                  Completar 
                  <HiCheck className="option-icon" />
                </span>
              </>
            )
          }

          {
            todoItem.status !== "archived" ? (
              <>
                <span
                  onClick={() => { handleOption("archive"); }}
                  className="overflowMenu-option archive"
                  role="menuitem"
                  tabIndex={0}
                >
                  Archivar 
                  <HiOutlineArchive className="option-icon" />
                </span>
              </>
            ) : (
            <>
            </>)
          }

          {
            (todoItem.status === "archived" || todoItem.isCompleted) ? (
              <span
                onClick={() => { handleOption("active"); }}
                className="overflowMenu-option active"
                role="menuitem"
                tabIndex={0}
              >
                Reactivar 
                <HiOutlineReply className="option-icon" />
              </span>
            ): (
              <span
                onClick={() => { handleOption("edit"); }}
                className="overflowMenu-option edit"
                role="menuitem"
                tabIndex={0}
              >
                Editar 
                <HiPencilAlt className="option-icon" />
              </span>
            )
          }

          <span
            onClick={() => { handleOption("delete"); }}
            className="overflowMenu-option delete"
            role="menuitem"
            tabIndex={0}
          >
            Borrar 
            <HiOutlineTrash className="option-icon" />
          </span>
        </div>
      )}
    </div>
  );
}

export { OverflowMenu };