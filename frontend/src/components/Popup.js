import React, { useEffect } from 'react';

const Popup = ({ isOpen, name, onClose, children }) => {
  useEffect(() => {
    if (!isOpen) return;
    const closeByEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    const closeByOverlay = (e) => {
      if (e.target.classList.contains('popup_open')) {
        onClose();
      }
    };
    document.addEventListener('keydown', closeByEscape);
    document.addEventListener('mousedown', closeByOverlay);

    return () => {
      document.removeEventListener('keydown', closeByEscape);
      document.removeEventListener('mousedown', closeByOverlay);
    };
  }, [isOpen, onClose]);

  return (
    <div className={`popup popup__type_${name} ${isOpen ? 'popup_open' : ''}`}>
      <div className={`popup__container popup__container_type_${name}`}>
        {children}
        <button
          className={'popup__close-button'}
          type="button"
          onClick={onClose}
        />
      </div>
    </div>
  );
};

export default Popup;
