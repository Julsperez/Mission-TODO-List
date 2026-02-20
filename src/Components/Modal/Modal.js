import React, {useRef, useEffect} from "react";
import { TodoContext } from "../../TodoContext";
import ReactDOM from "react-dom";
import "./Modal.css";

function Modal({ children }) {
	const { openTaskModal	} = React.useContext(TodoContext);
	const modalRef = useRef(null);
	useEffect(() => {
    if (openTaskModal && modalRef.current) {
      // Pequeño timeout para asegurar que el DOM se haya actualizado
      setTimeout(() => {
        modalRef.current.scrollIntoView({
          behavior: 'smooth', // Desplazamiento fluido
          block: 'start',    // Centra el modal en la pantalla
        });
      }, 100);
    }
  }, [openTaskModal]);

  if (!openTaskModal) return null;

	return ReactDOM.createPortal(
		<div ref={modalRef} className="modalContainer">
			{children}
		</div>,
		document.getElementById('modal-root')
	);
}

export { Modal };