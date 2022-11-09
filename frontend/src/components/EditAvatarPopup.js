import React, { useRef } from 'react';
import PopupWithForm from './PopupWithForm';

const EditAvatarPopup = ({ isOpen, onClose, onUpdateAvatar, isLoading }) => {
  const url = useRef();

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateAvatar(url.current.value);
  }

  React.useEffect(() => {
    url.current.value = '';
  }, [isOpen]);

  return (
    <PopupWithForm
      title="Change Profile Picture"
      name="avatar"
      isOpen={isOpen}
      onClose={onClose}
      buttonText={isLoading ? 'Saving...' : 'Save'}
      onSubmit={handleSubmit}
    >
      <fieldset className="form__fieldset">
        <input
          className="form__input"
          id="new-avatar"
          type="url"
          name="avatar"
          placeholder="Link to new Picture"
          required
          ref={url}
        />
        <span className="form__input_type_error" id="new-avatar-error"></span>
      </fieldset>
    </PopupWithForm>
  );
};

export default EditAvatarPopup;
