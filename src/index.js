import './css/styles.css';
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import SimpleLightbox from 'simplelightbox/dist/simple-lightbox.esm';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formElement = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreEl = document.querySelector('.load-more');
let page = 1;
let response;
let marcup;
let allPhotos;

function onSearchPhoto(event) {
  event.preventDefault();
  loadMoreEl.classList.add('is-hidden');
  galleryEl.value = '';
  galleryEl.innerHTML = '';
  getPhoto();
}
formElement.addEventListener('submit', onSearchPhoto);

async function getPhoto() {
  // let marcup;
  // let response;
  try {
    response = await axios.get(
      `https://pixabay.com/api/?key=30855873-a6914290544a804f7a5292a28&q=${formElement[0].value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
    );
    allPhotos = response.data.hits;
    console.log(response);
    if (response.data.total === 0) {
      throw new Error();
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (response.data.total <= 40) {
      Notiflix.Notify.success(
        `Hooray! We found ${response.data.totalHits} images.`
      );
      renderPhoto();
      // loadMoreEl.classList.toggle('is-hidden');
    } else if (response.data.total > 40) {
      Notiflix.Notify.success(
        `Hooray! We found ${response.data.totalHits} images.`
      );
      renderPhoto();
      loadMoreEl.classList.remove('is-hidden');
    }
  } catch (error) {
    console.error(error);
    loadMoreEl.classList.add('is-hidden');
    if (response.data.total === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else
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

function renderPhoto() {
  marcup = allPhotos
    .map(
      photo => `
           <a class="gallery__items" href="${photo.largeImageURL}">
      <img class="gallery__image" src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy" title=""/>
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
      </div></a>   
          `
    )
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', marcup);
}
