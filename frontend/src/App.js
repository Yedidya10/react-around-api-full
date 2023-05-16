import React, { useState, useEffect } from 'react';

import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import ImagePopup from './components/ImagePopup';
import { CurrentUserContext } from './contexts/CurrentUserContext';
import api from './utils/api.js';
import EditProfilePopup from './components/EditProfilePopup';
import EditAvatarPopup from './components/EditAvatarPopup';
import AddPlacePopup from './components/AddPlacePopup';
import DeletePopup from './components/DeletePopup';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import InfoTooltip from './components/InfoTooltip';
import * as auth from './utils/auth';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);

  const [infoTooltipType, setInfoTooltipType] = useState('');

  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState({
    name: '',
    link: '',
  });

  const [currentUser, setCurrentUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');

    if (jwt) {
      navigate('/signin');
      setIsLoggedIn(true);
      navigate('/');

      auth
        .getUserToken(jwt)
        .then((res) => {
          if (res.data._id) {
            setIsLoggedIn(true);
            setCurrentUser(res.data);
          }
        })
        .catch((err) => console.log(err));

      api
        .getInitialCards()
        .then((cards) => {
          if (cards === []) {
            return
          } else {
            setCards(cards);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [isLoggedIn, navigate]);

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };

  const closeAllPopups = () => {
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsImagePopupOpen(false);
    setIsDeletePopupOpen(false);
    setIsInfoTooltipOpen(false);
  };

  const handleCardClick = (card) => {
    setIsImagePopupOpen(true);
    setSelectedCard({
      name: card.name,
      link: card.link,
    });
  };

  const handleCardDeleteClick = (card) => {
    setIsDeletePopupOpen(true);
    setSelectedCard(card);
  };

  function handleCardLike(card) {
    const isLiked = card.likes?.some((userId) => userId === currentUser._id);

    api
      .toggleLike(card._id, currentUser._id, isLiked)
      .then((updatedCard) => {
        setCards(
          (cards) =>
            cards.map((eachCard) => eachCard._id === card._id ? updatedCard.card : eachCard
            ),
        );
      })
      .catch((err) => console.log(err));
  }

  const handleCardDelete = (e) => {
    e.preventDefault();
    setIsLoading(true);
    api
      .deleteCard(selectedCard._id)
      .then(() => {
        setCards((state) =>
          state.filter((currentCard) => currentCard._id !== selectedCard._id),
        );
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  const handleUpdateUser = ({ name, about }) => {
    setIsLoading(true);
    api
      .setUserInfo({ name, about })
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  const handleUpdateAvatar = (url) => {
    setIsLoading(true);
    api
      .setUserAvatar(url)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  function handleAddPlaceSubmit(card) {
    setIsLoading(true);
    api
      .createCard(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }

  function handleRegister({ email, password }) {
    setIsLoading(true);
    console.log("res");
    auth
      .register(email, password)
      .then((res) => {
        if (res) {
          setInfoTooltipType('successful');
          setIsInfoTooltipOpen(true);
          navigate('/signin');
        } else {
          setInfoTooltipType('failed');
        }
      })
      .catch((err) => {
        console.log(err);
        setInfoTooltipType('failed');
        setIsInfoTooltipOpen(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleLogin({ email, password }) {
    setIsLoading(true);
    auth
      .login(email, password)
      .then((res) => {
        if (res.token) {
          setIsLoggedIn(true);
          localStorage.setItem('jwt', res.token);
          navigate('/');
        }
      })
      .catch((err) => {
        console.log(err);
        setInfoTooltipType('failed');
        setIsInfoTooltipOpen(true);
      })
      .finally(() => setIsLoading(false));
  }

  function handleSignOut() {
    setIsLoggedIn(false);
    localStorage.removeItem('jwt');
    navigate('/signin');
   
    setCurrentUser({ 
      name: '',
      about: '',
      avatar: '',
      email: '',
    });
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header
        email={currentUser.email}
        isLoggedIn={isLoggedIn}
        handleSignOut={handleSignOut}
      />
      {isLoggedIn ? (
        <>
          <Routes>
            <Route exact path="/" element={<Main
              onEditProfileClick={handleEditProfileClick}
              onAddPlaceClick={handleAddPlaceClick}
              onEditAvatarClick={handleEditAvatarClick}
              cards={cards}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDeleteClick={handleCardDeleteClick}
            />}>
            </Route>
          </Routes>
        </>
      ) : (
        <>
          <Routes>
            <Route path="/signup" element={<Register handleRegister={handleRegister} isLoading={isLoading} />} />
            <Route path="/signin" element={<Login handleLogin={handleLogin} isLoading={isLoading} />} />
          </Routes>
        </>
      )}
      <Footer />
      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}
        isLoading={isLoading}
      />

      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}
        isLoading={isLoading}
      />

      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddPlaceSubmit={handleAddPlaceSubmit}
        isLoading={isLoading}
      />

      <DeletePopup
        isOpen={isDeletePopupOpen}
        onClose={closeAllPopups}
        onSubmitDelete={handleCardDelete}
        isLoading={isLoading}
      />

      <ImagePopup
        card={selectedCard}
        isOpen={isImagePopupOpen}
        onClose={closeAllPopups}
        name="image"
      />

      <InfoTooltip
        isOpen={isInfoTooltipOpen}
        onClose={closeAllPopups}
        type={infoTooltipType}
        name="tooltip"
      />
    </CurrentUserContext.Provider >
  );
}

export default App;
