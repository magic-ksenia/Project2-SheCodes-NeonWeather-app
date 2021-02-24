// ⏰     Function for Time format
function formatTime(timestamp) {
  let now = new Date(timestamp.dt * 1000);

  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

function formatLocalTime(props) {
  let localTime = new Date(props.dt * 1000);
  let localTimeOffset = localTime.getTimezoneOffset() * 60;
  localTime.setSeconds(
    localTime.getSeconds() + localTimeOffset + props.timezone
  );
  let localHours = localTime.getHours();
  if (localHours < 10) {
    localHours = `0${localHours}`;
  }
  let localMinutes = localTime.getMinutes();
  if (localMinutes < 10) {
    localMinutes = `0${localMinutes}`;
  }
  return `${localHours}:${localMinutes}`;
}

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatDate(timestamp) {
  let now = new Date(timestamp.dt * 1000);
  let date = now.getDate();
  let day = days[now.getDay()];
  let month = months[now.getMonth()];
  return `${month} ${date}, ${day} | ${formatTime(timestamp)}`;
}

function formatLocalDate(props) {
  let localTime = new Date(props.dt * 1000);
  let localTimeOffset = localTime.getTimezoneOffset() * 60;
  localTime.setSeconds(
    localTime.getSeconds() + localTimeOffset + props.timezone
  );
  let localDay = days[localTime.getDay()];
  let localMonth = months[localTime.getMonth()];
  let localDate = localTime.getDate();
  return `${localMonth} ${localDate},  ${localDay} | ${formatLocalTime(
    props
  )} `;
}

// 🌦  Current Weather API integration
function displayTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let countryElement = document.querySelector("#country");
  let descriptionElement = document.querySelector("#description");
  let feelslikeElement = document.querySelector("#feels-like");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date-time");
  let iconElement = document.querySelector("#icon");
  let localTimeElement = document.querySelector("#local-time");

  celsiusTemp = response.data.main.temp;
  feelslikeTempC = response.data.main.feels_like;

  temperatureElement.innerHTML = Math.round(celsiusTemp);
  cityElement.innerHTML = response.data.name;
  countryElement.innerHTML = response.data.sys.country;
  descriptionElement.innerHTML = response.data.weather[0].description;
  feelslikeElement.innerHTML = Math.round(feelslikeTempC);
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  dateElement.innerHTML = formatDate(response.data);
  localTimeElement.innerHTML = formatLocalDate(response.data);
  iconElement.setAttribute(
    "src",
    `../media/WeatherIcons/${response.data.weather[0].icon}.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
}

// 🌦  Forecast API integration
function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;
  for (let i = 0; i < 6; i++) {
    forecast = response.data.list[i];
    forecastMaxTempC = response.data.list[i].main.temp_max;
    forecastMinTempC = response.data.list[i].main.temp_min;
    forecastElement.innerHTML += `
    <div class="col-2">
              <h5 id="day-of-week">${formatTime(forecast)}</h5>
              <img src="media/WeatherIcons/${
                forecast.weather[0].icon
              }.png" alt="${forecast.weather[0].description}"/>
              <div class="weather-forecast-temperature">
                <strong><span id="forecast-max">${Math.round(
                  forecastMaxTempC
                )}</span>° </strong>∙
                <span id="forecast-min">${Math.round(forecastMinTempC)}</span>°
              </div>
            </div>`;
  }
}

// Search current weather+forecast by city (API call)
function search(city) {
  let apiKey = "2ccfd3ff79016dcd8763eb6a62db444b";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);

  let apiUrlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrlForecast).then(displayForecast);
}

// Search engine
function citySubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  if (cityInputElement.value) {
    search(cityInputElement.value);
  } else {
    alert(`Please enter a city to submit your search.`);
  }
}

// Units conversion
function displayFahrenheitTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");

  let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(fahrenheitTemp);

  let feelslikeTempF = (feelslikeTempC * 9) / 5 + 32;
  let feelslikeElement = document.querySelector("#feels-like");
  feelslikeElement.innerHTML = Math.round(feelslikeTempF);
  /*
  let forecastMaxTempF = (forecastMaxTempC * 9) / 5 + 32;
  let forecastMaxTempElement = document.querySelector("#forecast-max");
  let forecastMaxTempElements = document.querySelectorAll("#forecast-max");
  forecastMaxTempElements.forEach(
    (forecastMaxTempElement.innerHTML = Math.round(forecastMaxTempF))
  );

  
  let forecastMinTempElement = document.querySelector("#forecast-min");
    forecastMinTempElement.innerHTML = Math.round(forecastMinTempF);
   
  let forecastMinTempF = (forecastMinTempC * 9) / 5 + 32;
  let forecastMinTempElement = document.querySelector("#forecast-min");
  let forecastMinTempElements = document.querySelectorAll("#forecast-min");
  forecastMinTempElements.forEach(
    (forecastMinTempElement.innerHTML = Math.round(forecastMinTempF))
  );
    */
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");

  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemp);

  let feelslikeElement = document.querySelector("#feels-like");
  feelslikeElement.innerHTML = Math.round(feelslikeTempC);
  /*
  let forecastMaxTempElement = document.querySelector("#forecast-max");
  let forecastMaxTempElements = document.querySelectorAll("#forecast-max");
  forecastMaxTempElements.foreEach(
    (forecastMaxTempElement.innerHTML = Math.round(forecastMaxTempC))
  );

  let forecastMinTempElement = document.querySelector("#forecast-min");
  let forecastMinTempElements = document.querySelectorAll("#forecast-min");
  forecastMinTempElements.forEach(
    (forecastMinTempElement.innerHTML = Math.round(forecastMinTempC))
  );
  */
}

let celsiusTemp = null;
let feelslikeTempC = null;
/*
let forecastMinTempC = null;
let forecastMaxTempC = null;
*/
let formSearch = document.querySelector("#search-form");
formSearch.addEventListener("submit", citySubmit);

// default search
search("Dreamland");

let celsiusLink = document.querySelector("#display-celsius");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

let fahrenheitLink = document.querySelector("#display-fahrenheit");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

// Current geolocation weather now + forecast
function errorMessage(error) {
  alert("Oops! Could not find forward location.");
}

function currentLocationSearch(position) {
  let apiKey = "2ccfd3ff79016dcd8763eb6a62db444b";
  let currentLat = position.coords.latitude;
  let currentLong = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${currentLat}&lon=${currentLong}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature).catch(errorMessage);

  let apiUrlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${currentLat}&lon=${currentLong}&units=metric&appid=${apiKey}`;
  axios.get(apiUrlForecast).then(displayForecast);
}

function fetchLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(currentLocationSearch);
}

let currentLocationButton = document.querySelector("#current-location");
currentLocationButton.addEventListener("click", fetchLocation);
