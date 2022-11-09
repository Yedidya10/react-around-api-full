import React, { useContext } from 'react';
import Card from './Card';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

const Main = ({
  onEditAvatarClick,
  onEditProfileClick,
  onAddPlaceClick,
  cards,
  onCardClick,
  onCardLike,
  onCardDeleteClick,
}) => {
  const currentUser = useContext(CurrentUserContext);

  return (
    <main className="content">
      <section className="profile">
        <div className="profile__image-container" onClick={onEditAvatarClick}>
          <img
            className="profile__image"
            src={currentUser.avatar}
            alt="Users Round Avatar"
          />
        </div>
        <div className="profile__info">
          <div className="profile__person">
            <h1 className="profile__name">{currentUser.name}</h1>
            <button
              className="profile__edit-button"
              type="button"
              onClick={onEditProfileClick}
            />
          </div>
          <p className="profile__title">{currentUser.about}</p>
        </div>
        <button
          className="profile__add-button"
          type="button"
          onClick={onAddPlaceClick}
        />
      </section>
      <section className="cards">
        <ul className="cards__list">
          {cards.map((card) => {
            return (
              <Card
                card={card}
                key={card._id}
                onCardClick={onCardClick}
                onCardLike={onCardLike}
                onCardDelete={onCardDeleteClick}
              />
            );
          })}
        </ul>
      </section>
    </main>
  );
};

export default Main;
