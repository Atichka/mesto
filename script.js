class Card {
  constructor(name, link, likes, id, idCard, like) {
    this.cardElement = this.create(name, link, likes, id, idCard, like);
    this.like = this.like.bind(this);
    this.remove = this.remove.bind(this);
  }

  like(event) {
    event.target.classList.toggle('place-card__like_active');
  }
  remove(event) {
    if(event.target.closest('.place-card__delete-icon')) {
      event.target.parentNode.closest('.places-list').removeChild(event.target.closest('.place-card'));
    }
  }
  create(nameValue, linkValue, likes, id, idCard, like) {
    const element = document.createRange().createContextualFragment(`<div class="place-card" idCard=${idCard}>
      <div class="place-card__image">
        <button class="place-card__delete-icon"></button>
      </div>
      <div class="place-card__description">
        <h3 class="place-card__name"></h3>
        <div class="place-card__like">
          <button class="place-card__like-icon"></button>
          <h4 class="place-card__like-count">${likes}</h4>
        </div>
      </div>
    </div>`)
    element.querySelector('.place-card__name').textContent = nameValue;
    element.querySelector('.place-card__image').style.backgroundImage = 'url(' + linkValue + ')';
    element.querySelector('.place-card__like-icon').classList.add(like);
    if(id === myId.owner._id) {
      element.querySelector('.place-card__delete-icon').style.display = "block";
    }
    this.bindHandlers(element);
    return element;
  }

  bindHandlers(element) {
    element.querySelector('.place-card__delete-icon').addEventListener('click', this.remove);
  }
}

class CardList {
  constructor(container) {
    this.container = container;
  }

  render(cards) {
      let likeClassName;
   cards.forEach(element => {
      element.likes.forEach(el => {
        likeClassName = 'place-card__like-icon_liked';
        if(el._id === myId.owner._id) {
          likeClassName = 'place-card__like_active';
        };
      })
      this.addCard(element.name, element.link, element.likes.length, element.owner._id, element._id, likeClassName);
    });
  }

  addCard(name, link, likes, id, idCard, like) {
    const { cardElement } = new Card(name, link, likes, id, idCard, like);
    this.container.appendChild(cardElement);
  }
}
class Popup {
  constructor() {
    this.popupElement = document.querySelector('.popup');
    this.addButtonCard = document.querySelector('.popup__button');
    this.link = form.elements.link;
    this.name = form.elements.name;
  }

  openClosePopup() {
    this.popupElement.classList.toggle('popup_is-opened');
    this.addButtonCard.setAttribute('disabled', '');
    this.addButtonCard.classList.add('popup__button_disabled');
    this.name.value = '';
    this.link.value = '';
    this.validPopup();
  }

  validPopup() {
    const errorName = document.getElementById('nameError');
    const errorLink = document.getElementById('linkError');
    if (name.value === '') {
      errorName.textContent = "Это обязательное поле";

    } else if (((name.value.length < 2)) || (name.value.length > 30)) {
      errorName.textContent = lang.validationLenght;
    } else {
      errorName.textContent = "";
    }
    if (link.value === '') {
      errorLink.textContent = "Это обязательное поле";
    } else if (link.value.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) === null) {
      errorLink.textContent = "Здесь должна быть ссылка";
    } else {
      errorLink.textContent = "";
    }
  }

  statusButtonFormAdd () {
    if ((name.value.length < 2) || (link.value.length < 2)) {
      this.addButtonCard.setAttribute('disabled', '');
      this.addButtonCard.classList.add('popup__button_disabled');
    } else {

      this.addButtonCard.removeAttribute('disabled');
      this.addButtonCard.classList.remove('popup__button_disabled');
    }

  }
}

class PopupEdit {
  constructor() {
    this.popupEdit = document.querySelector('.popup-edit');
    this.editButtonProfile = document.querySelector('.popup-edit__button');
    this.name = document.querySelector('.popup-edit__input_type_name');
    this.job = document.querySelector('.popup-edit__input_type_aboutMe');
    this.nameProfile = formEdit.elements.nameProfile;
    this.aboutMe = formEdit.elements.aboutMe;
  }

  toggle() {
    this.popupEdit.classList.toggle('popup-edit_is-opened');
    this.editButtonProfile.setAttribute('disabled', '');
    this.editButtonProfile.classList.add('popup__button_disabled');
    this.name.value = profileName.textContent;
    this.job.value = profileJob.textContent;

    this.editButtonProfile.removeAttribute('disabled');
    this.editButtonProfile.classList.remove('popup__button_disabled');
    this.validPopupEdit();
  }

  validPopupEdit() {
    const errorProfileName = document.getElementById('nameProfileError');
    const errorAboutMe = document.getElementById('aboutMeError');
    if (nameProfile.value === '') {
      errorProfileName.textContent = "Это обязательное поле";
    } else if (((nameProfile.value.length >= 1) && (nameProfile.value.length < 2)) || (nameProfile.value.length > 30)) {
      errorProfileName.textContent = lang.validationLenght;
    } else {
      errorProfileName.textContent = "";
    }

    if (aboutMe.value === '') {
      errorAboutMe.textContent = "Это обязательное поле";
    } else if (((aboutMe.value.length >= 1) && (aboutMe.value.length < 2)) || (aboutMe.value.length > 30)) {
      errorAboutMe.textContent = lang.validationLenght;
    } else {
      errorAboutMe.textContent = "";
    }
  }

  newProfile(event) {
    event.preventDefault();
    const name = document.querySelector('.popup-edit__input_type_name');
    const job = document.querySelector('.popup-edit__input_type_aboutMe');
    const profileName = document.querySelector('.user-info__name');
    const profileJob = document.querySelector('.user-info__job');
    profileName.textContent = name.value;
    profileJob.textContent = job.value;

   apiUser
        .setUser(profileName.textContent, profileJob.textContent)
        .then(() => {
            popupEdit.toggle();
            form.reset();
        })
        .catch((err) => {
          console.log(`Ошибка: ${err}`);
        });
  }

  statusButtonFormEdit() {
    if ((nameProfile.value.length < 2) || (aboutMe.value.length < 2)) {
      editButtonProfile.setAttribute('disabled', '');
      editButtonProfile.classList.add('popup__button_disabled');
    } else {
      editButtonProfile.removeAttribute('disabled');
      editButtonProfile.classList.remove('popup__button_disabled');
    }
  }
}

class PopupPic {
  constructor() {
    this.popupPic = document.querySelector('.popup-pic');
  };

  openClosePopupPic() {
    this.popupPic.classList.toggle('popup_is-opened');
  }

  showPic(event) {
    if (event.target.matches('.place-card__image')) {
      const str = event.target.getAttribute('style');
      const link = str.slice(23, str.length - 3);
      popupPic.openClosePopupPic();
      const image = document.querySelector('.popup-pic__image');
      image.src = link;
    }
  }
}

class Profile {
  constructor(name) {
    this.name = name;
  }

  visualData(name, job, photo) {
    const profileName = document.querySelector('.user-info__name');
    const profileJob = document.querySelector('.user-info__job');
    const profilePhoto = document.querySelector('.user-info__photo');

    profileName.textContent = name;
    profileJob.textContent = job;
    profilePhoto.style.backgroundImage = 'url(' + photo + ')';
  }
}

class ApiUser {
  constructor() {
  }

  getUser() {
    return fetch(`${API_URL}/users/me`, {
      headers: {
        authorization: token.avtorization
      }
    })
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Что-то пошло не так: ${res.status}`);
    })
  }

  setUser(name, job) {
    return fetch(`${API_URL}/users/me`, {
      method: 'PATCH',
      headers: {
        authorization: token.avtorization,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        about: job
      })
    })
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Что-то пошло не так: ${res.status}`);
    })
  }
}

class ApiCard {
  constructor(name, link, token) {
    this.name = name;
    this.link = link;
  }

  getCard() {
    return fetch(`${API_URL}/cards`, {
      headers: {
          authorization: token.avtorization
      }
    })
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Что-то пошло не так: ${res.status}`);
    })
  }

  setCard(name, link) {
    return fetch(`${API_URL}/cards`, {
      method: 'POST',
      headers: {
        authorization: token.avtorization,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        link: link
      })
    })
    .then((res) => {
      console.log(res);
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Что-то пошло не так: ${res.status}`);
    })

  }

  deleteCard (teg) {
    const idCard = teg.getAttribute('idCard');
    return fetch(`${API_URL}/cards/${idCard}`, {
      method: 'DELETE',
      headers: {
        authorization: token.avtorization,
        'Content-Type': 'application/json'
      }
    })
    .then((res) => {
      console.log(res);
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Что-то пошло не так: ${res.status}`);
    })
  }

  setLike (teg, method) {
    const idCard = teg.getAttribute('idCard');
    return fetch(`${API_URL}/cards/like/${idCard}`, {
      method: method,
      headers: {
        authorization: token.avtorization,
        'Content-Type': 'application/json'
      }
    })
    .then((res) => {
      console.log(res);
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Что-то пошло не так: ${res.status}`);
    })
  }
};

const addButton = document.querySelector('.user-info__button');
const editButton = document.querySelector('.user-info__button-edit');
const closeButton = document.querySelector('.popup__close');
const closeEditButton = document.querySelector('.popup-edit__close');
const closePic = document.querySelector('.popup-pic__close');
const addButtonCard = document.querySelector('.popup__button');
const editButtonProfile = document.querySelector('.popup-edit__button');
const profileName = document.querySelector('.user-info__name');
const profileJob = document.querySelector('.user-info__job');
const plasesList = document.querySelector('.places-list');
const form = document.forms.new;
const formEdit = document.forms.edit;
const nameProfile = formEdit.elements.nameProfile;
const aboutMe = formEdit.elements.aboutMe;
const token = { avtorization: 'aab06295-ca94-4a87-ba1c-393efa74591e' };
const myId = {owner: {_id: '5683f6cb2359c61e0c26a85d'}};
const API_URL = 'http://95.216.175.5/cohort6'

const link = form.elements.link;
const name = form.elements.name;

const lang = { validationLenght: 'Должно быть от 2 до 30 символов' }

const cardlist = new CardList(document.querySelector('.places-list'));
const popup = new Popup();
const popupEdit = new PopupEdit();
const popupPic = new PopupPic();
const profile = new Profile();
const apiUser = new ApiUser(token);
const apiCard = new ApiCard(token);
const card = new Card();

// События
plasesList.addEventListener('click', popupPic.showPic);

addButton.addEventListener('click', () => popup.openClosePopup());

editButton.addEventListener('click', () => popupEdit.toggle());

// Закрытие окна добавления картинки
closeButton.addEventListener('click', () => popup.openClosePopup());

// Закрытие окна редактирования профиля
closeEditButton.addEventListener('click', () => popupEdit.toggle());

// Закрытие окна отображения картинки
closePic.addEventListener('click', () => popupPic.openClosePopupPic());

//Удаление карточки и лайки
plasesList.addEventListener('click', function(event) {
  const cardElement = event.target.parentNode.closest('.place-card')
  if(event.target.matches('.place-card__delete-icon')) {
    if(window.confirm("Вы действительно хотите удалить файл?")) {
      apiCard.deleteCard(event.target.closest('.place-card'))
      .then((result) => {
        console.log(result);
        card.remove(event);
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      });
    }
  }
  if(event.target.matches('.place-card__like_icon') && !(event.target.matches('.place-card__like-icon_liked'))) {
    apiCard.setLike(cardElement, 'DELETE')
    .then((result) => {
      console.log(result);
      card.like(event);
    })
    .catch((err) => {
      console.log(`Ошибка: ${err}`);
    });
  } else if(event.target.matches('.place-card__like-icon_liked')) {
    apiCard.setLike(cardElement, 'PUT')
    .then((result) => {
      console.log(result);
      card.like(event);
    })
    .catch((err) => {
      console.log(`Ошибка: ${err}`);
    });
  }
});

// Событие кнопки добавления карточки
form.addEventListener('submit', function(event) {
  addButtonCard.textContent = 'Загрузка...';
  event.preventDefault();

  cardlist.addCard(form.elements.name.value, form.elements.link.value, 0);
  apiCard.setCard(form.elements.name.value, form.elements.link.value, token)
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(`Ошибка: ${err}`);
    });

  popup.openClosePopup();
  form.reset();
  addButtonCard.setAttribute('disabled', '');
  addButtonCard.classList.add('popup__button_disabled');
  addButtonCard.textContent = '+';
});

// Событие кнопки обновления профиля
formEdit.addEventListener('submit', () => {
  editButtonProfile.textContent = 'Загрузка...';
  popupEdit.newProfile(event);
  editButtonProfile.textContent = 'Сохранить';
});

// Слушатель изменения состояния кнопки добавления картинок
form.addEventListener('input', () => popup.statusButtonFormAdd());

// Слушатель изменения состояния кнопки сохранения профиля
formEdit.addEventListener('input', () => popupEdit.statusButtonFormEdit());

name.addEventListener('input', popup.validPopup);
link.addEventListener('input', popup.validPopup);

nameProfile.addEventListener('input', popupEdit.validPopupEdit);
aboutMe.addEventListener('input', popupEdit.validPopupEdit);

window.addEventListener('load',function()
{
  apiUser.getUser()
  .then((result) => {
    console.log(result);
    return profile.visualData(result.name, result.about, result.avatar);
  })
  .catch((err) => {
    console.log(`Ошибка: ${err}`);
  })
})

window.addEventListener('load',function()
{
  apiCard.getCard()
  .then((result) => {
    console.log(result);
    return cardlist.render(result);
  })
  .catch((err) => {
    console.log(`Ошибка: ${err}`);
  })
})
