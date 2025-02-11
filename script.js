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

const weatherIcons = {
  '01d': '01d.png',
  '01n': '01n.png',
  '02d': '02d.png',
  '02n': '02n.png',
  '03d': '03d.png',
  '03n': '03n.png',
  '04d': '04d.png',
  '04n': '04n.png',
  '09d': '09d.png',
  '09n': '09n.png',
  '10d': '10d.png',
  '10n': '10n.png',
  '11d': '11d.png',
  '11n': '11n.png',
  '13d': '13d.png',
  '13n': '13n.png',
  '50d': '50d.png',
  '50n': '50n.png'
};

function getWeatherByCity(cityName) {
  loader.style.display = 'block';
  weatherInfo.style.display = 'none';

  const url = `${apiUrl}?q=${cityName}&appid=${apiKey}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
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

      const weatherIcon = weatherIcons[iconCode] || 'unknown.png';

      const weatherIconUrl = `icons/${weatherIcon}`;

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

      getForecast(cityName);
    })
    .catch((error) => {
      loader.style.display = 'none';
      weatherInfo.style.display = 'none';
      notFoundMessage.style.display = 'block';

      cityInput.style.display = 'none';
      searchBtn.style.display = 'none';
      console.error('Error fetching weather data for city:', error);
    });
}

function getForecast(cityName) {
  const url = `${forecastUrl}?q=${cityName}&appid=${apiKey}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      forecastItems.style.display = 'flex';
      forecastItems.innerHTML = '';

      for (let i = 0; i < 4; i++) {
        const forecast = data.list[i * 8];

        const forecastDate = new Date(forecast.dt * 1000);
        const forecastTemp = Math.round(forecast.main.temp - 273.15);
        const forecastDescription = forecast.weather[0].description;
        const forecastIconCode = forecast.weather[0].icon;

        const forecastIcon = weatherIcons[forecastIconCode] || 'unknown.png';

        const forecastIconUrl = `icons/${forecastIcon}`;

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
          <img src="${forecastIconUrl}" alt="Weather icon" class="forecast-item-img">
          <h5 class="forecast-item-temp">${forecastTemp} °C</h5>
        `;

        forecastItems.appendChild(forecastItem);
      }
    })
    .catch((error) => {
      console.error('Error fetching forecast data:', error);
    });
}

searchBtn.addEventListener('click', () => {
  if (cityInput.value.trim() !== '') {
    const cityName = cityInput.value.trim();
    getWeatherByCity(cityName);
    cityInput.value = '';
    cityInput.blur();
  }
});

cityInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && cityInput.value.trim() !== '') {
    const cityName = cityInput.value.trim();
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
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        getWeatherByCoordinates(latitude, longitude);
      },
      (error) => {
        console.error('Geolocation error:', error);
        weatherInfo.style.display = 'none';
        notFoundMessage.style.display = 'none';

        searchCityMessage.style.display = 'block';
        cityInput.style.display = 'block';
        searchBtn.style.display = 'block';

        alert(
          'Location access was denied. Please enter a city name to search.'
        );
      }
    );
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}

function getWeatherByCoordinates(latitude, longitude) {
  const url = `${apiUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
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

      const weatherIcon = weatherIcons[iconCode] || 'unknown.png';

      const weatherIconUrl = `icons/${weatherIcon}`;

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

      getForecast(city);
    })
    .catch((error) => {
      loader.style.display = 'none';
      weatherInfo.style.display = 'none';
      notFoundMessage.style.display = 'block';

      cityInput.style.display = 'none';
      searchBtn.style.display = 'none';
      console.error('Error fetching weather data for current location:', error);
    });
}

tryAgainButton.addEventListener('click', () => {
  notFoundMessage.style.display = 'none';
  searchCityMessage.style.display = 'block';

  cityInput.style.display = 'block';
  searchBtn.style.display = 'block';

  cityInput.value = '';
  cityInput.focus();
});
