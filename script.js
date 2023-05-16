const apiKey = "ef5d73bdf4fb5d3256ff879d60c303ce";
const MAX_LAST_CITIES = 10;
let lastCities = [];

function searchCity(event) {
  event.preventDefault();
  const input = document.querySelector("input");
  const cityName = input.value.trim();
  input.value = "";
  getLatLon(cityName);
  addCityToLastCities(cityName);
  updateLastCitiesUI();
}

function addCityToLastCities(cityName) {
  if (lastCities.length === MAX_LAST_CITIES) {
    lastCities.shift(); 
  }
  lastCities.push(cityName);
}

function updateLastCitiesUI() {
  const lastCitiesContainer = document.getElementById("lastCities");
  lastCitiesContainer.innerHTML = "";

  for (const city of lastCities) {
    const cityButton = document.createElement("button");
    cityButton.classList.add("btn", "btn-secondary");
    cityButton.textContent = city;
    cityButton.addEventListener("click", () => {
      getLatLon(city);
    });

    lastCitiesContainer.appendChild(cityButton);
  }
}




function getLatLon(cityName) {
  var URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

  fetch(URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("City not found");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      var lat = data[0].lat;
      var lon = data[0].lon;
      get5dayweather(lat, lon);
    })
    .catch((error) => {
      console.error(error);
    });
}

function get5dayweather(lat, lon) {
  var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("City not found");
      }
      return response.json();
    })
    .then((response) => {
      console.log(response);
      displayForecast(response);
    })
    .catch((error) => {
      console.error(error);
    });
}

function displayForecast(data) {
    const forecast = data.list;
    const city = data.city;
  
    const cities = document.querySelector(".cities");
    cities.innerHTML = "";
  
    const dailyForecasts = groupForecastsByDay(forecast);
  
    for (const [date, forecasts] of dailyForecasts) {
      const cityContainer = document.createElement("div");
      cityContainer.classList.add("city");
  
      const cityName = document.createElement("h2");
      cityName.classList.add("city-name");
      cityName.textContent = `${city.name}, ${city.country}`;
  
      const forecastDate = document.createElement("h3");
      forecastDate.classList.add("forecast-date");
      forecastDate.textContent = date;
  
      const cityTemp = document.createElement("div");
      cityTemp.classList.add("city-temp");
      const temperatureCelsius = Math.round(forecasts[0].main.temp - 273.15);
      cityTemp.textContent = `${temperatureCelsius}°C`;
  
      const cityTempHigh = document.createElement("div");
      cityTempHigh.classList.add("city-temp-high");
      const temperatureHighCelsius = Math.round(getTemperatureHigh(forecasts) - 273.15);
      cityTempHigh.textContent = `High: ${temperatureHighCelsius}°C`;
  
      const cityHumidity = document.createElement("div");
      cityHumidity.classList.add("city-humidity");
      const humidity = forecasts[0].main.humidity;
      cityHumidity.textContent = `Humidity: ${humidity}%`;
  
      const cityWindSpeed = document.createElement("div");
      cityWindSpeed.classList.add("city-windspeed");
      const windspeed = forecasts[0].wind.speed;
      cityWindSpeed.textContent = `Wind Speed: ${windspeed} m/s`;
  
      const cityIcon = document.createElement("img");
      cityIcon.classList.add("city-icon");
      cityIcon.src = `https://openweathermap.org/img/wn/${forecasts[0].weather[0].icon}.png`;
      cityIcon.alt = forecasts[0].weather[0].description;
  
      const iconCaption = document.createElement("figcaption");
      iconCaption.textContent = forecasts[0].weather[0].description;
  
      const figure = document.createElement("figure");
      figure.appendChild(cityIcon);
      figure.appendChild(iconCaption);
  
      cityContainer.appendChild(cityName);
      cityContainer.appendChild(forecastDate);
      cityContainer.appendChild(cityTemp);
      cityContainer.appendChild(cityTempHigh);
      cityContainer.appendChild(cityHumidity);
      cityContainer.appendChild(cityWindSpeed);
      cityContainer.appendChild(figure);
  
      cities.appendChild(cityContainer);
    }
  }
  
  

function groupForecastsByDay(forecast) {
    const groupedForecasts = new Map();
  
    for (const forecastItem of forecast) {
      const date = new Date(forecastItem.dt * 1000).toLocaleDateString("en-US", {
        weekday: "long",
      });
      const forecastList = groupedForecasts.get(date) || [];
      forecastList.push(forecastItem);
      groupedForecasts.set(date, forecastList);
    }
  
    return groupedForecasts;
  }
  
  function getTemperatureHigh(forecasts) {
    let temperatureHigh = -Infinity;
    for (const forecast of forecasts) {
      const temperature = forecast.main.temp_max;
      if (temperature > temperatureHigh) {
        temperatureHigh = temperature;
      }
    }
    return Math.round(temperatureHigh);
  }
  
  document.querySelector("form").addEventListener("submit", searchCity);
  document.querySelector("form").addEventListener("submit", searchCity);