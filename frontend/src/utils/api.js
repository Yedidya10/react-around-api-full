class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
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
      headers: this._headers,
    });
  }

  getUserInfo() {
    return this._request(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    });
  }

  setUserInfo({ name, about }) {
    return this._request(`${this._baseUrl}/users/me`, {
      headers: this._headers,
      method: 'PATCH',
      body: JSON.stringify({
        name: name,
        about: about,
      }),
    });
  }

  setUserAvatar(avatar) {
    return this._request(`${this._baseUrl}/users/me/avatar`, {
      headers: this._headers,
      method: 'PATCH',
      body: JSON.stringify({
        avatar: avatar,
      }),
    });
  }

  createCard(data) {
    return this._request(`${this._baseUrl}/cards`, {
      headers: this._headers,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  deleteCard(cardId) {
    return this._request(`${this._baseUrl}/cards/${cardId}`, {
      headers: this._headers,
      method: 'DELETE',
    });
  }

  toggleLike(cardId, isLiked) {
    let method;
    isLiked ? (method = 'DELETE') : (method = 'PUT');
    return this._request(`${this._baseUrl}/cards/likes/${cardId}`, {
      headers: this._headers,
      method: method,
    });
  }

  updateToken = () => {
    this.headers = {
      authorization: `Bearer ${localStorage.getItem('jwt')}`,
      'Content-Type': 'application/json',
    };
  };
}

const api = new Api({
  baseUrl: `https://api.yedidya.students.nomoredomainssbs.ru`,
  headers: {
    authorization: `Bearer ${localStorage.getItem('jwt')}`,
    'Content-Type': 'application/json',
  },
});

export default api;
