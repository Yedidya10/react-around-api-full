import React, { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

const Card = (props) => {
  const currentUser = useContext(CurrentUserContext);

  const isOwner = props.card.owner._id === currentUser._id;

  const isLiked = props.card.likes.some((user) => user._id === currentUser._id);

  const cardLikeButtonClassName = `card__like-button ${
    isLiked && 'card__like-button_active'
  }`;

  function handleClick() {
    props.onCardClick(props.card);
  }

  function handleLikeClick() {
    props.onCardLike(props.card);
  }

  function handleDeleteCard() {
    props.onCardDelete(props.card);
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
        src={props.card.link}
        alt={props.card.name}
        onClick={handleClick}
      />
      <div className="card__title-wrapper">
        <h2 className="card__title">{props.card.name}</h2>
        <div className="card__likes-wrapper">
          <button
            className={cardLikeButtonClassName}
            type="button"
            onClick={handleLikeClick}
          />
          <span className="card__likes-count">{props.card.likes.length}</span>
        </div>
      </div>
    </li>
  );
};

export default Card;
