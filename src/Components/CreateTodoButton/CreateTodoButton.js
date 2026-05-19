import { useTranslation } from 'react-i18next';
import "./CreateTodoButton.css";
function CreateTodoButton({setOpenTaskModal}) {
  const { t } = useTranslation();
  return (
    <button
      aria-label={t('app.create_btn_label')}
      className="createTodoButton"
      onClick={() => setOpenTaskModal(true)}>
      +
    </button>
  );
}

export { CreateTodoButton };