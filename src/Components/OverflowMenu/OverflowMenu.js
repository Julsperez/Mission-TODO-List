import React from "react";
import { useTranslation } from 'react-i18next';
import {
  HiCheck,
  HiPencilAlt,
  HiOutlineTrash,
  HiOutlineReply,
  HiOutlineArchive,
  HiOutlineClock,
  HiOutlineDotsHorizontal
} from "react-icons/hi";
import { TodoContext } from "../../TodoContext";
import "./OverflowMenu.css";

function OverflowMenu({ todoItem, onSelectedOption }) {
  const { t } = useTranslation();
  const {
    setOpenTaskModal,
    setIsEditTask,
    setTask,
    setIsShowPomodoro
  } = React.useContext(TodoContext);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = React.useState(false);
  const menuRef = React.useRef(null);

  const toggleIsOpen = (event) => {
    event.stopPropagation();
    if (isOpen) setIsConfirmingDelete(false);
    setIsOpen(prev => !prev);
  };

  const handleOption = (event, option) => {
    event.stopPropagation();
    onSelectedOption(option);
    setIsOpen(false);
    setIsConfirmingDelete(false);
  };

  const handleEdit = (event) => {
    event.stopPropagation();
    setOpenTaskModal(true);
    setIsEditTask(true);
    setTask(todoItem);
    setIsOpen(false);
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsConfirmingDelete(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setIsConfirmingDelete(false);
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
                  onClick={(event) => { handleOption(event, "complete"); }}
                  className="overflowMenu-option complete"
                  role="menuitem"
                  tabIndex={0}
                >
                  {t('overflow_menu.complete')}
                  <HiCheck className="option-icon" />
                </span>


                {todoItem.status === "in-progress" && (
                  <span
                    onClick={(event) => {
                      event.stopPropagation();
                      setTask(todoItem);
                      setOpenTaskModal(true);
                      setIsShowPomodoro(true);
                      setIsOpen(false);
                    }}
                    className="overflowMenu-option pomodoro"
                    role="menuitem"
                    tabIndex={0}
                  >
                    {t('overflow_menu.pomodoro')}
                    <HiOutlineClock className="option-icon" />
                  </span>
                )}
              </>
            )
          }

          {
            todoItem.status !== "archived" ? (
              <>
                <span
                  onClick={(event) => { handleOption(event, "archive"); }}
                  className="overflowMenu-option archive"
                  role="menuitem"
                  tabIndex={0}
                >
                  {t('overflow_menu.archive')}
                  <HiOutlineArchive className="option-icon" />
                </span>
              </>
            ) : (
              <></>)
          }

          {
            (todoItem.status === "archived" || todoItem.isCompleted) ? (
              <span
                onClick={(event) => { handleOption(event, "active"); }}
                className="overflowMenu-option active"
                role="menuitem"
                tabIndex={0}
              >
                {t('overflow_menu.reactivate')}
                <HiOutlineReply className="option-icon" />
              </span>
            ) : (
              <span
                onClick={handleEdit}
                className="overflowMenu-option edit"
                role="menuitem"
                tabIndex={0}
              >
                {t('overflow_menu.edit')}
                <HiPencilAlt className="option-icon" />
              </span>
            )
          }

          {isConfirmingDelete ? (
            <div className="overflowMenu-confirmDelete" onClick={(e) => e.stopPropagation()}>
              <span className="confirmDelete-text">{t('overflow_menu.confirm_delete')}</span>
              <div className="confirmDelete-actions">
                <button
                  className="confirmDelete-btn yes"
                  onClick={(event) => { handleOption(event, "delete"); }}
                >
                  {t('overflow_menu.confirm_yes')}
                </button>
                <button
                  className="confirmDelete-btn no"
                  onClick={(event) => { event.stopPropagation(); setIsConfirmingDelete(false); }}
                >
                  {t('overflow_menu.confirm_cancel')}
                </button>
              </div>
            </div>
          ) : (
            <span
              onClick={(event) => { event.stopPropagation(); setIsConfirmingDelete(true); }}
              className="overflowMenu-option delete"
              role="menuitem"
              tabIndex={0}
            >
              {t('overflow_menu.delete')}
              <HiOutlineTrash className="option-icon" />
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export { OverflowMenu };
