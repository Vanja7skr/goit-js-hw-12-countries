const BASE_URL = 'https://api.restcountries.com/countries/v5';

export default function fetchCountries(searchQuery) {
  return fetch(`${BASE_URL}?q=${searchQuery}`, {
    headers: {
      Authorization: `Bearer ${process.env.RC_API_KEY}`,
    },
  }).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
