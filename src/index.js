import Notiflix from 'notiflix';
import axios from 'axios';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';

const searchForm = document.getElementById('search-form');
const searchInput = document.querySelector('[name="searchQuery"]');
const loadMore = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');
const buttonbg = document.querySelector('.button-bg');

let currentPage = 1;
let currentSearchQuery = '';
let isNewSearch = true;

const lightbox = new SimpleLightbox('.gallery a');

searchForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const searchQuery = searchInput.value;

  if (searchQuery !== currentSearchQuery) {
    gallery.innerHTML = '';
    isNewSearch = true;
    currentSearchQuery = searchQuery;
    currentPage = 1;
    loadMore.style.display = 'none';
    buttonbg.style.display = 'none';
    await performSearch(searchQuery);
  }
});

loadMore.addEventListener('click', async function () {
  await performSearch(currentSearchQuery);
});

async function performSearch(query) {
  const apiKey = '40580679-3803f3c8f1db93e9a2d3d1f51';
  const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=40`;

  try {
    const response = await axios.get(apiUrl);

    handleSearchResults(response.data);

    updateLoadMoreAndNotify(response.data.totalHits);

    if (response.data.hits.length > 0) {
      lightbox.refresh();

      currentPage++;
    }
  } catch (error) {
    console.error('Error during fetch:', error);
  }
}

function handleSearchResults(data) {
  const currentHTML = gallery.innerHTML;
  const markup = data.hits
    .map(
      image => `
      <div class="photo-card">
        <a href="${image.largeImageURL}" class="simple" data-lightbox="gallery">
          <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item"><b>Likes</b>: ${image.likes}</p>
          <p class="info-item"><b>Views</b>: ${image.views}</p>
          <p class="info-item"><b>Comments</b>: ${image.comments}</p>
          <p class="info-item"><b>Downloads</b>: ${image.downloads}</p>
        </div>
      </div>
    `
    )
    .join('');

  if (currentPage === 1) {
    gallery.innerHTML = '';
  }

  gallery.innerHTML = currentHTML + markup;
}

function updateLoadMoreAndNotify(totalHits) {
  if (currentPage * 40 >= totalHits) {
    loadMore.style.display = 'none';
    buttonbg.style.display = 'none';
    if (isNewSearch && totalHits === 0 && currentPage === 1) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } else {
    setTimeout(() => {
      loadMore.style.display = 'flex';
      buttonbg.style.display = 'flex';
    }, 1000);
  }

  if (isNewSearch && totalHits > 0) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    isNewSearch = false;
  }
}
