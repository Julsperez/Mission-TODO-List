import React from "react";
import ReactDOM from "react-dom";
import "./Modal.css";

function Modal({ children, onClose }) {
	return ReactDOM.createPortal(
		<div className="modalOverlay" onClick={onClose}>
			<div className="modalContainer" onClick={(e) => e.stopPropagation()}>
				{children}
			</div>
		</div>,
		document.getElementById('modal-root')
	);
}

export { Modal };
