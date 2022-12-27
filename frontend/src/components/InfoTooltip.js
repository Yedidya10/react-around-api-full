import React, { useEffect } from 'react';
import successIcon from '../images/icons/success_icon.svg';
import failedIcon from '../images/icons/failed_icon.svg';

import Popup from './Popup';

const InfoTooltip = ({ isOpen, onClose, type, name }) => {
  const success = type === 'successful';

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <Popup isOpen={isOpen} name={name} onClose={onClose}>
      <img
        src={success ? successIcon : failedIcon}
        className="tooltip__image"
        alt={`${success ? 'successful' : 'failed'} attempt`}
      />
      <h2 className="tooltip__text">
        {success
          ? 'Success! You have now been registered.'
          : 'Oops, something went wrong! Please try again.'}
      </h2>
    </Popup>
  );
};

export default InfoTooltip;
