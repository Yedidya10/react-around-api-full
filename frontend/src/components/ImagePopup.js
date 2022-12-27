import React from 'react';
import Popup from './Popup';

const ImagePopup = (props) => {
  return (
    <Popup isOpen={props.isOpen} name={props.name} onClose={props.onClose}>
      <img className="popup__image" src={props.card.link} alt="place" />
      <p className="popup__description">{props.card.name}</p>
    </Popup>
  );
};

export default ImagePopup;
