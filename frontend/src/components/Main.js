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
  const user = useContext(CurrentUserContext);
  const name = user ? user.username : null;
  const about = user ? user.about : null;
  const avatar = user ? user.avatar : null;
  
  return (
    <main className="content">
      <section className="profile">
        <div className="profile__image-container" onClick={onEditAvatarClick}>
          <img
            className="profile__image"
            src={avatar}
            alt="User Avatar"
          />
        </div>
        <div className="profile__info">
          <div className="profile__person">
            <h1 className="profile__name">{name}</h1>
            <button
              className="profile__edit-button"
              type="button"
              onClick={onEditProfileClick}
            />
          </div>
          <p className="profile__title">{about}</p>
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
                key={card._id}
                card={card}
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
