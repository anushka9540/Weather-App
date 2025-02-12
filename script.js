const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');
const weatherInfo = document.querySelector('.weather-info');
const cityNameElement = document.querySelector('.country-text');
const weatherSummaryImg = document.querySelector('.weather-summary-img');
const tempText = document.querySelector('.temp-text');
const conditionText = document.querySelector('.condition-text');
const humidityValueText = document.querySelector('.humidity-value-text');
const windValueText = document.querySelector('.wind-value-text');
const pressureValueText = document.querySelector('.pressure-value-text');
const feelsValueText = document.querySelector('.feels-value-text');
const forecastItems = document.querySelector('.forecast-item-container');
const searchCityMessage = document.querySelector('.search-city');
const notFoundMessage = document.querySelector('.not-found');
const tryAgainButton = document.querySelector('.try-again');
const loader = document.querySelector('.loader');
const apiKey = '82005d27a116c2880c8f0fcb866998a0';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';
let lastSearchedCity = '';

async function fetchWeatherData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

function processWeatherData(data) {
  if (!data) {
    loader.style.display = 'none';
    if (
      !notFoundMessage.style.display ||
      notFoundMessage.style.display === 'none'
    ) {
      searchCityMessage.style.display = 'none';
      cityInput.style.display = 'none';
      searchBtn.style.display = 'none';
    }
    weatherInfo.style.display = 'none';
    notFoundMessage.style.display = 'block';
    return;
  }
  loader.style.display = 'none';
  weatherInfo.style.display = 'block';
  searchCityMessage.style.display = 'none';
  notFoundMessage.style.display = 'none';
  cityInput.style.display = 'block';
  searchBtn.style.display = 'block';
  cityNameElement.textContent = `${data.name}, ${data.sys.country}`;
  tempText.textContent = `${Math.round(data.main.temp - 273.15)} °C`;
  conditionText.textContent = data.weather[0].description;
  humidityValueText.textContent = `${data.main.humidity}%`;
  windValueText.textContent = `${data.wind.speed} m/s`;
  pressureValueText.textContent = `${data.main.pressure} hPa`;
  feelsValueText.textContent = `${Math.round(
    data.main.feels_like - 273.15
  )} °C`;
  const iconCode = data.weather[0].icon;
  weatherSummaryImg.src = iconCode
    ? `icons/${iconCode}.png`
    : 'icons/default.png';
  getForecast(data.name);
}

function getWeatherByCity(cityName) {
  cityName = cityName.toLowerCase();
  if (cityName === lastSearchedCity) return;
  lastSearchedCity = cityName;
  loader.style.display = 'block';
  weatherInfo.style.display = 'none';
  const url = `${apiUrl}?q=${cityName}&appid=${apiKey}`;
  fetchWeatherData(url).then((data) => processWeatherData(data));
}

function getForecast(cityName) {
  const url = `${forecastUrl}?q=${cityName}&appid=${apiKey}`;
  fetchWeatherData(url).then((data) => {
    if (!data) return;
    forecastItems.style.display = 'flex';
    forecastItems.innerHTML = '';
    for (let i = 0; i < 4; i++) {
      const forecast = data.list[i * 8];
      const forecastDate = new Date(forecast.dt * 1000);
      const forecastTemp = Math.round(forecast.main.temp - 273.15);
      const forecastIconCode = forecast.weather[0].icon;
      const forecastIconUrl = forecastIconCode
        ? `icons/${forecastIconCode}.png`
        : './icons/unknown.png';
      const forecastItem = document.createElement('div');
      forecastItem.classList.add('forecast-item');
      forecastItem.innerHTML = `
        <h5 class="forecast-item-date regular-text">${forecastDate.toLocaleDateString(
          'en-GB',
          { weekday: 'short', day: 'numeric', month: 'short' }
        )}</h5>
        <img src="${forecastIconUrl}" alt="Weather icon" class="forecast-item-img">
        <h5 class="forecast-item-temp">${forecastTemp} °C</h5>
      `;
      forecastItems.appendChild(forecastItem);
    }
  });
}

searchBtn.addEventListener('click', () => {
  const cityName = cityInput.value.trim();
  if (cityName !== '') {
    getWeatherByCity(cityName);
    cityInput.value = '';
    cityInput.blur();
  }
});

cityInput.addEventListener('keydown', (event) => {
  const cityName = cityInput.value.trim();
  if (event.key === 'Enter' && cityName !== '') {
    getWeatherByCity(cityName);
    cityInput.value = '';
    cityInput.blur();
  }
});

window.onload = () => {
  weatherInfo.style.display = 'none';
  searchCityMessage.style.display = 'block';
  notFoundMessage.style.display = 'none';
  getUserLocation();
};

function getUserLocation() {
  loader.style.display = 'block';
  searchCityMessage.style.display = 'none';
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        getWeatherByCoordinates(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      () => {
        loader.style.display = 'none';
        searchCityMessage.style.display = 'block';
        cityInput.style.display = 'block';
        searchBtn.style.display = 'block';
        alert(
          'Location access was denied. Please enter a city name to search.'
        );
      }
    );
  } else {
    loader.style.display = 'none';
    alert('Geolocation is not supported by this browser.');
  }
}

function getWeatherByCoordinates(latitude, longitude) {
  const url = `${apiUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
  fetchWeatherData(url).then((data) => processWeatherData(data));
}

tryAgainButton.addEventListener('click', () => {
  notFoundMessage.style.display = 'none';
  searchCityMessage.style.display = 'block';
  cityInput.style.display = 'block';
  searchBtn.style.display = 'block';
  cityInput.value = '';
  cityInput.focus();
});

function formatDate(date) {
  const options = { weekday: 'short', day: 'numeric', month: 'short' };
  return date.toLocaleDateString('en-GB', options);
}

// Get the current date
const currentDate = new Date();

// Set the formatted date inside the h5 element
document.getElementById('current-date').textContent = formatDate(currentDate);
