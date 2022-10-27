import './css/styles.css';
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

console.log(SimpleLightbox);

var debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;
var lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionSelector: 'img',
  captionType: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
  enableKeyboard: true,
  heightRatio: 0.9,
});

let gallery = new SimpleLightbox('.gallery a');
gallery.on('show.simplelightbox', function () {
  // do something…
});

gallery.on('error.simplelightbox', function (e) {
  console.log(e); // some usefull information
});

const formElement = document.querySelector('.search-form');
console.dir(formElement);

const inputEl = document.querySelector('.search-form input');
console.log(inputEl);

const btnSubmitEl = document.querySelector('.search-form button');
console.log(btnSubmitEl);

const galleryEl = document.querySelector('.gallery');
console.log(galleryEl);

const loadMoreEl = document.querySelector('.load-more');
console.log(loadMoreEl);

let page = 1;

// const { height: cardHeight } = document
//   .querySelector('.gallery')
//   .getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: 'smooth',
// });

function onSearchPhoto(event) {
  event.preventDefault();
  console.log(formElement[0].value);
  console.log(event);
  getPhoto();
  // loadMoreEl.classList.remove('is-hidden');
}
formElement.addEventListener('submit', onSearchPhoto);

async function getPhoto() {
  let marcup;
  // console.log(formElement[0].value);
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=30855873-a6914290544a804f7a5292a28&q=${formElement[0].value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
    );
    const allPhotos = response.data.hits;
    console.log(allPhotos);
    // console.log(allPhotos);
    if (allPhotos.length === 0) {
      throw new Error();
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notiflix.Notify.success(
        `Hooray! We found ${response.data.totalHits} images.`
      );
      marcup = allPhotos
        .map(
          photo => `
          <div class="photo-card gallery__items">
          <a class="gallery__item" href="${photo.largeImageURL}">
      <img class="gallery__image" src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy" title=""/>
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes: ${photo.likes}</b>
        </p>
        <p class="info-item">
          <b>Views: ${photo.views}</b>
        </p>
        <p class="info-item">
          <b>Comments: ${photo.comments}</b>
        </p>
        <p class="info-item">
          <b>Downloads: ${photo.downloads}</b>
        </p>
      </div>
    </div>
          `
        )
        .join('');
    }
    galleryEl.insertAdjacentHTML('beforeend', marcup);
    loadMoreEl.classList.remove('is-hidden');
  } catch (error) {
    console.error(error);
    loadMoreEl.classList.add('is-hidden');
    Notiflix.Notify.failure(
      `We're sorry, but you've reached the end of search results.`
    );
  }
}

function onLoadPhoto(event) {
  console.log(event);
  page += 1;
  getPhoto();
}

loadMoreEl.addEventListener('click', onLoadPhoto);
