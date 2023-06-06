const catBreeds =
  'https://api.thecatapi.com/v1/breeds?api_key=live_pnO057QwBBR2FuVx0XGwucpamirx1mR2sCuBpEMc9YIXWrDDOguylFKAOMLjevvV';

const chosenCatInfo = 'https://api.thecatapi.com/v1/images/search';

const catFilter = document.querySelector('.breed-select');
let loading = document.querySelector('.loader');
let errorInfo = document.querySelector('.error');
const catCard = document.querySelector('.cat-info');

function hideAlert(loader) {
  loader.classList.add('hidden');
}
hideAlert(loading);
hideAlert(errorInfo);
function showAlert(loader) {
  loader.classList.remove('hidden');
}
function pingUrl(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          reject(errorInfo);
        } else {
          return response.json();
        }
      })
      .then(data => {
        resolve(data);
      })
      .catch(err => reject(err));
  });
}

function fetchBreeds() {
  pingUrl(catBreeds).then(data => {
    const catChoices = data
      .map(dataOne => `<option value='${dataOne.id}'>${dataOne.name}</option>`)
      .join('');
    catFilter.insertAdjacentHTML('afterbegin', catChoices);
  });
}
fetchBreeds();

async function fetchCatByBreed(breedId) {
  try {
    const catUrl = `${chosenCatInfo}?breed_ids=${breedId}`;
    const catData = await pingUrl(catUrl);
    const pictureLink = `<div><img src="${catData[0].url}" class="cat-pic"></div>`;
    catCard.insertAdjacentHTML('afterbegin', pictureLink);
  } catch (error) {
    showAlert(errorInfo);
  }

  try {
    const catInfo = `https://api.thecatapi.com/v1/breeds/${breedId}`;
    const catData = await pingUrl(catInfo);
    const catDescription = `<div class="cat-txt"><h1>${catData.name}</h1><p>${catData.description}</p><h2>Temperament</h2><p>${catData.temperament}</p></div>`;
    catCard.insertAdjacentHTML('beforeend', catDescription);
  } catch (error) {
    showAlert(errorInfo);
  }
}

function handleFilterForm(e) {
  hideAlert(errorInfo);
  showAlert(loading);
  catCard.innerHTML = '';
  fetchCatByBreed(e.target.value);
  setTimeout(function () {
    hideAlert(loading);
  }, 500);
}

catFilter.addEventListener('change', handleFilterForm);
