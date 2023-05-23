import React, { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

const Card = ({ card, onCardClick, onCardLike, onCardDelete }) => {
  const currentUser = useContext(CurrentUserContext);

  const isOwner = card.owner === currentUser._id;
  
  const isLiked = card.likes?.some((userId) => {
    return userId === currentUser._id;
  });

  const cardLikeButtonClassName = `card__like-button ${isLiked && 'card__like-button_active'
    }`;

  function handleClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteCard() {
    onCardDelete(card);
  }

  return (
    <li className="card">
      {isOwner && (
        <button
          className="card__delete-button"
          type="button"
          onClick={handleDeleteCard}
        />
      )}
      <img
        className="card__image"
        src={card.link}
        alt={card.name}
        onClick={handleClick}
      />
      <div className="card__title-wrapper">
        <h2 className="card__title">{card.name}</h2>
        <div className="card__likes-wrapper">
          <button
            className={cardLikeButtonClassName}
            type="button"
            onClick={handleLikeClick}
          />
          <span className="card__likes-count">{card?.likes?.length}</span>
        </div>
      </div>
    </li>
  );
};

export default Card;
