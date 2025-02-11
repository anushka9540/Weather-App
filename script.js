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
    weatherInfo.style.display = 'none';
    notFoundMessage.style.display = 'block';
    cityInput.style.display = 'none';
    searchBtn.style.display = 'none';
    return;
  }

  loader.style.display = 'none';
  weatherInfo.style.display = 'block';
  searchCityMessage.style.display = 'none';
  notFoundMessage.style.display = 'none';

  cityInput.style.display = 'block';
  searchBtn.style.display = 'block';

  const city = data.name;
  const country = data.sys.country;
  const temperatureKelvin = data.main.temp;
  const description = data.weather[0].description;
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;
  const pressure = data.main.pressure;
  const feelsLike = data.main.feels_like;

  const iconCode = data.weather[0].icon;
  const weatherIconUrl = `icons/${iconCode}.png`;

  const temperatureCelsius = Math.round(temperatureKelvin - 273.15);
  const feelsLikeCelsius = Math.round(feelsLike - 273.15);

  cityNameElement.textContent = `${city}, ${country}`;
  tempText.textContent = `${temperatureCelsius} °C`;
  conditionText.textContent = description;
  humidityValueText.textContent = `${humidity}%`;
  windValueText.textContent = `${windSpeed} m/s`;
  pressureValueText.textContent = `${pressure} hPa`;
  feelsValueText.textContent = `${feelsLikeCelsius} °C`;

  weatherSummaryImg.src = weatherIconUrl;
  weatherSummaryImg.onerror = () => {
    weatherSummaryImg.src = './icons/unknown.png'; // Default icon
  };

  getForecast(city);
}

function getWeatherByCity(cityName) {
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
      const forecastIconUrl = `icons/${forecastIconCode}.png`;

      const forecastItem = document.createElement('div');
      forecastItem.classList.add('forecast-item');

      forecastItem.innerHTML = `
        <h5 class="forecast-item-date regular-text">${forecastDate.toLocaleDateString(
          'en-GB',
          {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
          }
        )}</h5>
        <img src="${forecastIconUrl}" alt="Weather icon" class="forecast-item-img" onerror="this.src='icons/default.png'">
        <h5 class="forecast-item-temp">${forecastTemp} °C</h5>
      `;

      forecastItems.appendChild(forecastItem);
    }
  });
}

searchBtn.addEventListener('click', () => {
  if (cityInput.value.trim() !== '') {
    getWeatherByCity(cityInput.value.trim());
    cityInput.value = '';
    cityInput.blur();
  }
});

cityInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && cityInput.value.trim() !== '') {
    getWeatherByCity(cityInput.value.trim());
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
