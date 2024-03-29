const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://api.around.us.to' : 'http://localhost:3000';

class Api {
  constructor({ baseUrl }) {
    this._baseUrl = baseUrl;
  }

  _getHeaders() {
    return {
      'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
      'Content-Type': 'application/json',
    };
  }

  _checkResponse(res) {
    if (res.ok) return res.json();
    else return Promise.reject(res.statusText);
  }

  async _request(url, headers) {
    return await fetch(url, headers).then(this._checkResponse);
  }

  getInitialCards() {
    return this._request(`${this._baseUrl}/cards`, {
      headers: this._getHeaders(),
    });
  }

  getUserInfo() {
    return this._request(`${this._baseUrl}/users/me`, {
      headers: this._getHeaders(),
    });
  }

  setUserInfo({ name, about }) {
    return this._request(`${this._baseUrl}/users/me`, {
      headers: this._getHeaders(),
      method: 'PATCH',
      body: JSON.stringify({
        name: name,
        about: about,
      }),
    });
  }

  setUserAvatar(avatar) {
    return this._request(`${this._baseUrl}/users/me/avatar`, {
      headers: this._getHeaders(),
      method: 'PATCH',
      body: JSON.stringify({
        avatar: avatar,
      }),
    });
  }

  createCard(data) {
    return this._request(`${this._baseUrl}/cards`, {
      headers: this._getHeaders(),
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  deleteCard(cardId) {
    return this._request(`${this._baseUrl}/cards/${cardId}`, {
      headers: this._getHeaders(),
      method: 'DELETE',
    });
  }

  toggleLike(cardId, currentUserId, isLiked) {
    let method;
    isLiked ? (method = 'DELETE') : (method = 'PUT');

    return this._request(`${this._baseUrl}/cards/likes/${cardId}`, {
      headers: this._getHeaders(),
      method: method,
      body: JSON.stringify({
        userId: currentUserId,
      }),
    });
  }

  updateToken = () => {
    this.headers = {
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      'Content-Type': 'application/json',
    };
  };
}

const api = new Api({
  baseUrl: BASE_URL,
});

export default api;
