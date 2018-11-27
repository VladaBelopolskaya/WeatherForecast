'use strict';

const WEEKDAY = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
const MONTH = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
const NUMBER_OF_DAYS = 4;

/**
 * Поиск элемента в массиве data, который является сегодняшним днем
 * @return {number} номер элемента в массиве data
 */
const getTodayItem = () => {
    const currentDate = new Date();
    const currentDateDay = currentDate.getDate();
    const currentDateMonth = currentDate.getMonth();
    const currentDateYear = currentDate.getFullYear();
    let numberOfTodayItem = 0;

    window.weatherforcast.data.forEach((item, i) => {
        const myDate = new Date(item.date);
        const myDateDay = myDate.getDate();
        const myDateMonth = myDate.getMonth();
        const myDateYear = myDate.getFullYear();
        if (currentDateDay === myDateDay && currentDateMonth === myDateMonth && currentDateYear === myDateYear) {
            numberOfTodayItem = i;
        }
    });
    return numberOfTodayItem;
};

/**
 * Определение осадков для карточки
 * @param {boolean} snow
 * @param {boolean} rain
 * @return {string} описание осадков
 */
const getPrecipitation = (snow, rain) => {
    if (!snow && !rain) {
        return 'без осадков'
    }
    if (!snow && rain) {
        return 'дождь'
    }
    if (snow && !rain) {
        return 'снег'
    }
    return 'дождь со снегом'
};

/**
 * Определение картинки для карточки
 * @param {boolean} cloudiness
 * @param {boolean} snow
 * @param {boolean} rain
 * @return {string} адрес картинки
 */
const getImage = (cloudiness, snow, rain) => {
    if (!cloudiness) {
        return 'img/sun.png'
    }
    if (cloudiness && !snow && !rain) {
        return 'img/cloud.png'
    }
    if (cloudiness && !snow && rain) {
        return 'img/rain.png'
    }
    if (cloudiness && snow && !rain) {
        return 'img/snow.png'
    }
    return 'img/rain&snow.png'
};

/**
 * Создание NUMBER_OF_DAYS карточек
 * @param {Number} numberOfCurrentItem номер объекта в массиве data, с которого нужно начинать создание карточек
 * @param {Number} numberOfTodayItem номер элемента с текущей датой
 * @return {DocumentFragment}
 */
const createCards = (numberOfCurrentItem, numberOfTodayItem) => {
    const templateCard = document.querySelector('#card').content.querySelector('.weather-card');
    let fragment = document.createDocumentFragment();
    for (let i = numberOfCurrentItem; i < numberOfCurrentItem + NUMBER_OF_DAYS; i++) {
        let symbolDay = '';
        let symbolNight = '';
        const newElementCard = templateCard.cloneNode(true);
        const currentItem = window.weatherforcast.data[i];
        const date = new Date(currentItem.date);

        if (i === numberOfTodayItem) {
            newElementCard.querySelector('.weekday').textContent = 'Сегодня';
        } else {
            newElementCard.querySelector('.weekday').textContent = WEEKDAY[date.getDay()];
        }
        newElementCard.querySelector('.date').textContent = date.getDate() + ' ' + MONTH[date.getMonth()];
        newElementCard.querySelector('.image').src = getImage(currentItem.cloudiness, currentItem.snow, currentItem.rain);
        if (currentItem.temperature.day > 0) {
            symbolDay = '+';
        }
        newElementCard.querySelector('.temperature-day').textContent = 'днем ' + symbolDay + currentItem.temperature.day + '°';
        if (currentItem.temperature.night > 0) {
            symbolNight = '+';
        }
        newElementCard.querySelector('.temperature-night').textContent = 'ночью ' + symbolNight + currentItem.temperature.night + '°';
        newElementCard.querySelector('.precipitation').textContent = getPrecipitation(currentItem.snow, currentItem.rain);
        fragment.appendChild(newElementCard);
    }
    return fragment;
};

/**
 * Дизейбл кнопки, если мы находимся в крайних значениях
 * @param {Number} numberOfCurrentItem номер текущего первого элемента
 */
const disabledButton = (numberOfCurrentItem) => {
    const leftButton = document.querySelector('.button-left');
    const rightButton = document.querySelector('.button-right');
    leftButton.disabled = false;
    rightButton.disabled = false;
    if (numberOfCurrentItem === 0) {
        leftButton.disabled = true;
    }
    if (numberOfCurrentItem === window.weatherforcast.data.length - NUMBER_OF_DAYS) {
        rightButton.disabled = true;
    }
};

/**
 * Добавление карточек в DOM + дизейбл кнопки
 * @param {Number} currentItem номер первого элемента для отрисовки
 * @param {Number} numberOfTodayItem номер элемента с текущей датой
 */
const insertCardToDom = (numberOfCurrentItem, numberOfTodayItem) => {
    const weather = document.querySelector('.weather');
    const cards = createCards(numberOfCurrentItem, numberOfTodayItem);
    weather.innerHTML = '';
    weather.appendChild(cards);

    disabledButton(numberOfCurrentItem);
};

/**
 * Переключение на предыдущую карточку
 */
const previousCard = () => {
    if (numberOfCurrentItem > 0) {
        numberOfCurrentItem -= 1;
        insertCardToDom(numberOfCurrentItem, numberOfTodayItem);
    }
};

/**
 * Переключение на следующую карточку
 */
const nextCard = () => {
    if (numberOfCurrentItem < window.weatherforcast.data.length - NUMBER_OF_DAYS) {
        numberOfCurrentItem += 1;
        insertCardToDom(numberOfCurrentItem, numberOfTodayItem);
    }
};


const numberOfTodayItem = getTodayItem();
let numberOfCurrentItem = numberOfTodayItem;
insertCardToDom(numberOfCurrentItem, numberOfTodayItem);

const leftButton = document.querySelector('.button-left');
const rightButton = document.querySelector('.button-right');
leftButton.addEventListener('click', previousCard);
rightButton.addEventListener('click', nextCard);
