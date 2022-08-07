/** Global Constants
 ******************************************************************************/
const CURRENT_WEATHER_CONTAINER_EL = document.querySelector(".city-weather-stats-container");
const FORECAST_WEATHER_CONTAINER_EL = document.querySelector(".daily-forecast-container");
const SAVED_CITIES_CONTAINER_EL = document.querySelector(".saved-city-container");

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

var savedCities = [];

/** Function Definitions
 *****************************************************************************/
/** SERVER FETCH APIs Functions*/
var getCurrentWeatherData = (city) => {
  var geoCoorApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

  //request for the geo coordinates for the city
  fetch(geoCoorApiUrl)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function (geoCoor) {
      var weatherApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${geoCoor[0].lat}&lon=${geoCoor[0].lon}&appid=${apiKey}&units=metric&exclude=daily,hourly,minutely`;

      // request for the weather for the city
      fetch(weatherApiUrl)
        .then(function (response) {
          if (response.ok) {
            return response.json();
          }
        })
        .then(function (data) {
          displayWeatherData(city, data);
        })
        .catch(function (error) {
          alert("Unable to connect to OpenWeather: " + error);
        });
    });
};

var getWeatherForcastData = (city) => {
  var weatherForcastsApiUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  fetch(weatherForcastsApiUrl)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function (data) {
      displayWeatherForcast(data);
    })
    .catch(function (error) {
      alert("Unable to connect to Open Weather: " + error);
    });
};

//Wrapper for functions above
var getCityWeather = (event) => {
  var [city, ...element] = event.target.id.split("-");
  console.log(city);
  clearWeatherData();
  // valid city return the current weather and forecasts
  getCurrentWeatherData(city);
  getWeatherForcastData(city);
};

/** Display Data Functions*/
var displayWeatherData = (city, data) => {
  // Step 1: Add the city header
  var cityHeaderEl = document.createElement("h2");
  cityHeaderEl.classList = "city-current-header";
  cityHeaderEl.textContent = city + " (" + getTheDate() + ") ";
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
  windSpeedEl.textContent =
    "Wind: " + convertMetersPerSecToKMh(data.current.wind_speed) + " " + UNITS.metric.speed;
  // Append to current
  CURRENT_WEATHER_CONTAINER_EL.appendChild(windSpeedEl);

  // Step 4: Add the humidity
  var humidityEl = document.createElement("p");
  humidityEl.classList = "humidity";
  humidityEl.textContent = "Humidity: " + data.current.humidity + "%";
  // Append to current
  CURRENT_WEATHER_CONTAINER_EL.appendChild(humidityEl);

  // Step 5: Add the UV index
  var uvIndexRatingColour;
  var uvIndex = data.current.uvi;
  if (uvIndex <= 2) {
    //safe UV index
    uvIndexRatingColour = "text-bg-success";
  } else if (uvIndex <= 7) {
    // moderate UV index
    uvIndexRatingColour = "text-bg-warning";
  } else {
    // high UV index
    uvIndexRatingColour = "text-bg-danger";
  }
  var uvIndexEl = document.createElement("p");
  uvIndexEl.classList = "uvindex";
  uvIndexEl.textContent = "UV Index: ";
  var uvSpanEl = document.createElement("span");
  uvSpanEl.classList = "badge " + uvIndexRatingColour;
  uvSpanEl.textContent = data.current.uvi;
  uvIndexEl.appendChild(uvSpanEl);
  // Append to current
  CURRENT_WEATHER_CONTAINER_EL.appendChild(uvIndexEl);
};

var displayWeatherForcast = (data) => {
  //from the data set get 5 results
  // results for a day are every 3 hour intervals
  for (let i = 0; i < data.list.length; i += 8) {
    let dayForcast = data.list[i];

    createForcastElement(dayForcast);
  }
};

var createForcastElement = (day) => {
  //create container for the forcast
  var dayForecastContainerEl = document.createElement("div");
  dayForecastContainerEl.classList = "col p-3";
  FORECAST_WEATHER_CONTAINER_EL.appendChild(dayForecastContainerEl);

  // Step 1: append the date
  var dateEl = document.createElement("div");
  dateEl.classList = "p-1";
  dateEl.textContent = getTheDateParam(day.dt_txt);

  dayForecastContainerEl.appendChild(dateEl);

  // Step 2: append the icon
  var weatherIconEl = document.createElement("img");
  weatherIconEl.setAttribute(
    "src",
    "http://openweathermap.org/img/w/" + day.weather[0].icon + ".png"
  );
  weatherIconEl.setAttribute("alt", day.weather[0].description);
  dayForecastContainerEl.appendChild(weatherIconEl);

  // Step 3: append the temp
  var tempEl = document.createElement("div");
  tempEl.classList = "p-1";
  tempEl.textContent = "Temp: " + day.main.temp + "\xb0" + UNITS.metric.temp;

  dayForecastContainerEl.appendChild(tempEl);

  // Step 4: append the wind
  var windEl = document.createElement("div");
  windEl.classList = "p-1";
  windEl.textContent = "Wind: " + day.wind.speed + UNITS.metric.speed;

  dayForecastContainerEl.appendChild(windEl);
  // Step 5: append the humidity
  var humidityEl = document.createElement("div");
  humidityEl.classList = "p-1";
  humidityEl.textContent = "Humidity: " + day.main.humidity + " %";

  dayForecastContainerEl.appendChild(humidityEl);
};

var createCityButton = (city) => {
  var cityButtonContainerEl = document.createElement("div");
  cityButtonContainerEl.classList = "row p-2";

  SAVED_CITIES_CONTAINER_EL.appendChild(cityButtonContainerEl);

  var cityButtonEl = document.createElement("button");
  cityButtonEl.id = city + "-btn";
  cityButtonEl.classList = "btn btn-outline-info";
  cityButtonEl.textContent = city;

  cityButtonContainerEl.appendChild(cityButtonEl);

  // add event listener
  document.querySelector("#" + city + "-btn").addEventListener("click", getCityWeather);
};
/** Utility Functions
 ******************************************************************************/
var clearWeatherData = () => {
  // remove children of the current weather
  while (CURRENT_WEATHER_CONTAINER_EL.firstChild) {
    CURRENT_WEATHER_CONTAINER_EL.removeChild(CURRENT_WEATHER_CONTAINER_EL.firstChild);
  }

  // remove childe of the forcast
  while (FORECAST_WEATHER_CONTAINER_EL.firstChild) {
    FORECAST_WEATHER_CONTAINER_EL.removeChild(FORECAST_WEATHER_CONTAINER_EL.firstChild);
  }
};
var convertMetersPerSecToKMh = (speed) => {
  return Math.round(speed * 3.6).toFixed(2);
};

var getTheDateParam = (date) => {
  var [day, time] = date.split(" ");
  day = day.replaceAll("-", "/");
  // console.log(day);

  return day;
};
var getTheDate = () => {
  var today = new Date();
  var day = String(today.getDate());
  var month = String(today.getMonth() + 1); // Jan is 0
  var year = today.getFullYear();

  today = day + "/" + month + "/" + year;
  return today;
};

var validCity = (city) => {
  if (!city) {
    alert("Please enter a valid city");
    return false;
  }
  return true;
};

var getStoredCities = () => {
  tempCities = JSON.parse(localStorage.getItem("savedCities"));

  if (!tempCities) {
    return [];
  }
  return tempCities;
};
var saveCity = (city) => {
  //check if button is already created
  if ($("#" + city + "-btn").length) {
    console.log("city button already exists");
  }
  //if it doesnt exist create the button and add it to location storage
  else {
    savedCities = getStoredCities();
    console.log(savedCities);

    //check if city is already in storage
    if (!savedCities.includes(city)) {
      //update localStorage
      savedCities.push(city);
      localStorage.setItem("savedCities", JSON.stringify(savedCities));

      //show button of saved city
      createCityButton(city);
    }
  }
};

var loadPreviouslySearchedCities = () => {
  savedCities = getStoredCities();

  savedCities.forEach((city) => createCityButton(city));
};
/** Main Program
 ******************************************************************************/
loadPreviouslySearchedCities();

var searchCityButton = $("#search-input-city-btn");

searchCityButton.click(function () {
  //get input
  var cityInput = $("#input-city").val();
  if (!validCity(cityInput)) {
    //not valid city return function
    return;
  } else {
    // clear any old weather data
    clearWeatherData();
    // valid city return the current weather and forecasts
    getCurrentWeatherData(cityInput);
    getWeatherForcastData(cityInput);
    saveCity(cityInput);
  }
});
