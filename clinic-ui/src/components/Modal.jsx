import React from 'react';
import '../Modal.css'; // Import CSS for modal styles

const Modal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>&times;</span>
        <h2>Modal Title</h2>
        <p>Modal content goes here...</p>
        {/* Other content or form elements */}
      </div>
    </div>
  );
};

export default Modal;
