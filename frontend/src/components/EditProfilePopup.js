import React, { useContext, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { useForm } from '../utils/hooks/useForm';

const EditProfilePopup = ({ isOpen, onClose, onUpdateUser, isLoading }) => {
  const currentUser = useContext(CurrentUserContext);

  const { values, handleChange, setValues } = useForm({});

  useEffect(() => {
    setValues({ name: currentUser.name, about: currentUser.about });
  }, [currentUser, isOpen]);

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateUser({
      name: values.name,
      about: values.about,
    });
  }

  return (
    <PopupWithForm
      title="Edit profile"
      name="edit-profile"
      buttonText={`${isLoading ? 'Saving...' : 'Save'}`}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <fieldset className="form__fieldset">
        <input
          className="form__input"
          id="name-input"
          type="text"
          name="name"
          placeholder="Name"
          minLength="2"
          maxLength="40"
          value={values.name || ''}
          onChange={handleChange}
          required
        />
        <span className="form__input_type_error" id="name-input-error" />
        <input
          className="form__input"
          id="title-input"
          type="text"
          name="about"
          placeholder="About me"
          minLength="2"
          maxLength="200"
          value={values.about || ''}
          onChange={handleChange}
          required
        />
        <span className="form__input_type_error" id="title-input-error" />
      </fieldset>
    </PopupWithForm>
  );
};

export default EditProfilePopup;
