import React, { useState, useEffect } from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import api from '../utils/api.js';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import DeletePopup from './DeletePopup';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';
import * as auth from '../utils/auth';

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
  const [userData, setUserData] = useState({
    email: '',
  });
  const [loggedIn, setLoggedIn] = useState(false);
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    api
      .getUserInfo()
      .then((user) => {
        setCurrentUser(user);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    api
      .getInitialCards()
      .then((res) => {
        setCards(res);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      setIsLoading(true);
      auth
        .checkToken(jwt)
        .then((res) => {
          if (res.data._id) {
            setLoggedIn(true);
            setUserData({ email: res.data.email });
            history.push('/react-around-auth');
          }
        })
        .catch((err) => {
          console.log(err);
          history.push('/signin');
        })
        .finally(() => setIsLoading(false));
    }
  }, [history]);

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
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
    const isLiked = card.likes.some((user) => user._id === currentUser._id);

    api
      .toggleLike(card._id, isLiked)
      .then((newCard) => {
        setCards((cards) =>
          cards.map((currentCard) =>
            currentCard._id === card._id ? newCard : currentCard
          )
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
          state.filter((currentCard) => currentCard._id !== selectedCard._id)
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
    auth
      .register(email, password)
      .then((res) => {
        if (res.data._id) {
          setInfoTooltipType('successful');
          setIsInfoTooltipOpen(true);
          history.push('/signin');
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
          setLoggedIn(true);
          setUserData({ email });
          localStorage.setItem('jwt', res.token);
          history.push('/react-around-auth');
        }
      })
      .catch((err) => {
        console.log(err);
        setInfoTooltipType('failed');
        setIsInfoTooltipOpen(true);
      })
      .finally(() => setIsLoading(false));
  }

  function handleSignout() {
    setLoggedIn(false);
    localStorage.removeItem('jwt');
    history.push('/signin');
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header
        loggedIn={loggedIn}
        email={userData.email}
        handleSignout={handleSignout}
      />
      <Switch>
        <ProtectedRoute exact path="/react-around-auth" loggedIn={loggedIn}>
          <Main
            onEditProfileClick={handleEditProfileClick}
            onAddPlaceClick={handleAddPlaceClick}
            onEditAvatarClick={handleEditAvatarClick}
            cards={cards}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDeleteClick={handleCardDeleteClick}
          />
        </ProtectedRoute>

        <Route path="/signup">
          <Register handleRegister={handleRegister} isLoading={isLoading} />
        </Route>

        <Route path="/signin">
          <Login handleLogin={handleLogin} isLoading={isLoading} />
        </Route>

        <Route>
          {loggedIn ? (
            <Redirect to="/react-around-auth" />
          ) : (
            <Redirect to="/signin" />
          )}
        </Route>
      </Switch>
      {loggedIn && <Footer />}

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
    </CurrentUserContext.Provider>
  );
}

export default App;
