import debounce from 'lodash.debounce';
import { error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import fetchCountries from './fetchCountries';
import './sass/index.scss';

const searchBox = document.querySelector('#search-box');
const output = document.querySelector('#output');

searchBox.addEventListener('input', debounce(onSearchInput, 500));

function onSearchInput(event) {
  const searchQuery = event.target.value.trim();

  if (!searchQuery) {
    output.innerHTML = '';
    return;
  }

  fetchCountries(searchQuery)
    .then(result => renderCountries(result.data.objects))
    .catch(() => {
      output.innerHTML = '';
      error({ text: 'Country not found.' });
    });
}

function renderCountries(countries) {
  if (countries.length > 10) {
    output.innerHTML = '';
    error({
      text: 'Too many matches found. Please enter a more specific query!',
    });
    return;
  }

  if (countries.length > 1) {
    output.innerHTML = createCountriesList(countries);
    return;
  }

  if (countries.length === 1) {
    output.innerHTML = createCountryCard(countries[0]);
    return;
  }

  output.innerHTML = '';
}

function createCountriesList(countries) {
  const items = countries
    .map(({ names }) => `<li>${names.common}</li>`)
    .join('');
  return `<ul>${items}</ul>`;
}

function createCountryCard({ names, capitals, population, languages, flag }) {
  const languagesItems = languages
    .map(({ name }) => `<li>${name}</li>`)
    .join('');

  return `
    <h1>${names.common}</h1>
    <div class="country">
      <div>
        <p><b>Capital:</b> ${capitals[0].name}</p>
        <p><b>Population:</b> ${population}</p>
        <p><b>Languages:</b></p>
        <ul>${languagesItems}</ul>
      </div>
      <img src="${flag.url_svg}" alt="Flag of ${names.common}" width="320" />
    </div>
  `;
}