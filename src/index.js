import "./pages/index.css";

import {Card, CardList, Popup, PopupEdit, PopupPic, Profile, ApiUser, ApiCard} from "./script.js";

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

const lang = { validationLenght: 'Должно быть от 2 до 30 символов' }
const serverUrl = NODE_ENV === 'development' ? 'https://praktikum.tk/cohort6' : 'https://praktikum.tk/cohort6';

const cardlist = new CardList(document.querySelector('.places-list'));
const popup = new Popup();
const popupEdit = new PopupEdit();
const popupPic = new PopupPic();
const profile = new Profile();

const apiUser = new ApiUser({
  url: serverUrl, 
  headers: {
  authorization: "aab06295-ca94-4a87-ba1c-393efa74591e",
  "Content-Type": "application/json"
  }
});

const apiCard = new ApiCard({
  url: serverUrl, 
  headers: {
  authorization: "aab06295-ca94-4a87-ba1c-393efa74591e",
  "Content-Type": "application/json"
  }
});

const card = new Card();

window.addEventListener('load', function()
{
  apiUser.getUser()
  .then(result => {
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

