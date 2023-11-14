import axios from 'axios';

const breeds = document.querySelector('#breed-select');

axios.defaults.headers.common['x-api-key'] = 'live_m3DbR21LqZXay1ULiCE6Wjca4zHyvoRxpi6w3ERozLcoKEGMgs0xjjStA2weLASc';

export function fetchBreeds() {
  return axios.get('https://api.thecatapi.com/v1/breeds')
    .then((response) => {
      if (response.status !== 200) {
        console.error('Failed to fetch data');
        return [];
      }
      return response.data.map((breed) => ({ id: breed.id, name: breed.name }));
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      return [];
    });
}

export function renderUsers(cats) {
    const markup = cats
      .map((breed) => {
        return `<li>
            <p><b>Name</b>: ${breed.name}</p>
            <p><b>Breed</b>: ${breed.id}</p>
          </li>`;
      })
      .join("");
    breeds.insertAdjacentHTML("beforeend", markup);
  }