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
const tryAgainButton = document.querySelector('.try-again'); // Button to try again

const apiKey = '82005d27a116c2880c8f0fcb866998a0';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

function getWeatherByCity(cityName) {
  const url = `${apiUrl}?q=${cityName}&appid=${apiKey}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {

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
      const icon = data.weather[0].icon;

      const temperatureCelsius = Math.round(temperatureKelvin - 273.15);
      const feelsLikeCelsius = Math.round(feelsLike - 273.15);

      cityNameElement.textContent = `${city}, ${country}`;
      tempText.textContent = `${temperatureCelsius} °C`;
      conditionText.textContent = description;
      humidityValueText.textContent = `${humidity}%`;
      windValueText.textContent = `${windSpeed} m/s`;
      pressureValueText.textContent = `${pressure} hPa`;
      feelsValueText.textContent = `${feelsLikeCelsius} °C`;

      weatherSummaryImg.src = `http://openweathermap.org/img/wn/${icon}.png`;

      getForecast(cityName);
    })
    .catch((error) => {
      console.error('Error fetching weather data for city:', error);
      weatherInfo.style.display = 'none';
      notFoundMessage.style.display = 'block';

     
      cityInput.style.display = 'none';
      searchBtn.style.display = 'none';
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
        const forecastIcon = forecast.weather[0].icon;

        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');

        forecastItem.innerHTML = `
          <h5 class="forecast-item-date regular-text">${forecastDate.toLocaleDateString('en-GB', {
            weekday: 'short', day: 'numeric', month: 'short'
          })}</h5>
          <img src="http://openweathermap.org/img/wn/${forecastIcon}.png" alt="" class="forecast-item-img">
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
        searchCityMessage.style.display = 'block';

        
        notFoundMessage.style.display = 'block';
        searchCityMessage.style.display = 'none';
        cityInput.style.display = 'none';
        searchBtn.style.display = 'none';
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
      const icon = data.weather[0].icon;

      const temperatureCelsius = Math.round(temperatureKelvin - 273.15);
      const feelsLikeCelsius = Math.round(feelsLike - 273.15);

      cityNameElement.textContent = `${city}, ${country}`;
      tempText.textContent = `${temperatureCelsius} °C`;
      conditionText.textContent = description;
      humidityValueText.textContent = `${humidity}%`;
      windValueText.textContent = `${windSpeed} m/s`;
      pressureValueText.textContent = `${pressure} hPa`;
      feelsValueText.textContent = `${feelsLikeCelsius} °C`;

      weatherSummaryImg.src = `http://openweathermap.org/img/wn/${icon}.png`;

      getForecast(city);
    })
    .catch((error) => {
      console.error('Error fetching weather data for current location:', error);
      weatherInfo.style.display = 'none';
      notFoundMessage.style.display = 'block';

      
      cityInput.style.display = 'none';
      searchBtn.style.display = 'none';
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
