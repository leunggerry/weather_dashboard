/** Global Constants
 ******************************************************************************/
const CURRENT_WEATHER_CONTAINER_EL = document.querySelector(".city-weather-stats-container");
const FORECAST_WEATHER_CONTAINER_EL = document.querySelector(".city-weather-5day-forcast-container");

const CELSIUS = "C";
const FAHREHEIT = "H";
const UNITS = {
  metric: {
    temp: "C",
    speed: "km/h",
  },
  imperial: {
    temp: "F",
    speed: "MPH",
  },
};
/** Global Variables
 ******************************************************************************/
var apiKey = config.SECRET_API_KEY;
var currentWeatherObj = {
  temperature: 0,
  wind: 0,
  humidity: 0,
  uvIndex: 0,
};
var cityWeatherObj = {
  currentWeather: currentWeatherObj,
  forcast: [],
};

/** Function Definitions
 *****************************************************************************/
/** SERVER FETCH APIs Fucntions*/
var getCurrentWeatherData = (city) => {
  var geoCoorApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

  console.log("getting coordinates");
  //request for the geo coordinates for the city
  fetch(geoCoorApiUrl)
    .then(function (response) {
      if (response.ok) {
        // console.log(response.json());
        return response.json();
      }
    })
    .then(function (geoCoor) {
      var weatherApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${geoCoor[0].lat}&lon=${geoCoor[0].lon}&appid=${apiKey}&units=metric&exclude=daily,hourly,minutely`;
      console.log("getting current weather from " + city);

      // request for the weather for the city
      fetch(weatherApiUrl)
        .then(function (response) {
          if (response.ok) {
            // console.log(response.json());
            return response.json();
          }
        })
        .then(function (data) {
          //   console.log(city);
          //   console.log(data.current.weather[0]);
          //   console.log(data.current.wind);
          displayWeatherData(city, data);
        })
        .catch(function (error) {
          alert("Unable to connect to OpenWeather: " + error);
        });
    });
};

var getWeatherForcastData = (city) => {
  var weatherForcastsApiUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  console.log("getting forcasts from " + city);
  fetch(weatherForcastsApiUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response.json());
      }
    })
    .catch(function (error) {
      alert("Unable to connect to Open Weather: " + error);
    });
};

/** Display Data Functions*/
var displayWeatherData = (city, data) => {
  //   console.log(data);
  // Step 1: Add the city header

  var cityHeaderEl = document.createElement("h2");
  cityHeaderEl.classList = "city-current-header";
  cityHeaderEl.textContent = city + " ";
  // Append to current weather
  CURRENT_WEATHER_CONTAINER_EL.appendChild(cityHeaderEl);

  // Step 1a: get weather icon
  var weatherIconEl = document.createElement("img");
  weatherIconEl.setAttribute(
    "src",
    "http://openweathermap.org/img/w/" + data.current.weather[0].icon + ".png"
  );
  weatherIconEl.setAttribute("alt", data.current.weather[0].description);
  cityHeaderEl.appendChild(weatherIconEl);

  // Step 2: Add the temperature
  var temperatureEl = document.createElement("p");
  temperatureEl.classList = "temperature";
  temperatureEl.textContent = "Temp: " + data.current.temp + "\xb0" + UNITS.metric.temp;
  // Append to current
  CURRENT_WEATHER_CONTAINER_EL.appendChild(temperatureEl);

  // Step 3: Add the wind speed
  var windSpeedEl = document.createElement("p");
  windSpeedEl.classList = "wind";
  windSpeedEl.textContent = "Wind: " + data.current.wind_speed + " " + UNITS.metric.speed;
  // Append to current
  CURRENT_WEATHER_CONTAINER_EL.appendChild(windSpeedEl);

  // Step 4: Add the humidity
  var humidityEl = document.createElement("p");
  humidityEl.classList = "humidity";
  humidityEl.textContent = "Humidity: " + data.current.humidity + "%";
  // Append to current
  CURRENT_WEATHER_CONTAINER_EL.appendChild(humidityEl);

  // Step 5: Add the UV index
  var uvIndexEl = document.createElement("p");
  uvIndexEl.classList = "uvindex";
  uvIndexEl.textContent = "UV Index: " + data.current.uvi;
  // Append to current
  CURRENT_WEATHER_CONTAINER_EL.appendChild(uvIndexEl);
};

/** Main Program
 ******************************************************************************/
getCurrentWeatherData("Toronto");
//getWeatherForcastData("Toronto");
