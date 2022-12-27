import React from 'react';
import PopupWithForm from './PopupWithForm';
import { useForm } from '../utils/hooks/useForm';

const AddPlacePopup = ({ isOpen, onClose, onAddPlaceSubmit, isLoading }) => {
  const { values, handleChange, setValues } = useForm({});

  function handleSubmit(e) {
    e.preventDefault();
    const { name, link } = values;
    onAddPlaceSubmit({ name, link });
  }

  React.useEffect(() => {
    setValues({});
  }, [isOpen]);

  return (
    <PopupWithForm
      title="New place"
      name="add-place"
      isOpen={isOpen}
      onClose={onClose}
      buttonText={`${isLoading ? 'Creating...' : 'Create'}`}
      onSubmit={handleSubmit}
    >
      <fieldset className="form__fieldset">
        <input
          id="place-name"
          type="text"
          name="name"
          placeholder="Title"
          className="form__input"
          minLength="1"
          maxLength="30"
          value={values.name || ''}
          onChange={handleChange}
          required
        />
        <span id="place-name-error"></span>
        <input
          id="place-url"
          type="url"
          name="link"
          placeholder="Image URL"
          className="form__input"
          value={values.link || ''}
          onChange={handleChange}
          required
        />
        <span id="place-url-error"></span>
      </fieldset>
    </PopupWithForm>
  );
};

export default AddPlacePopup;
