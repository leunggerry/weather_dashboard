/** Global Variables
 ******************************************************************************/
var apiKey = config.SECRET_API_KEY;

/** Function Definitions
 *****************************************************************************/
var getWeatherData = (city) => {
  var weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  console.log("getting weather from " + city);

  // request for the weather for the city
  fetch(weatherApiUrl)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function (data) {
      console.log(data.name);
      console.log(data.main);
      console.log(data.weather[0]);
      console.log(data.wind);
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeather: " + error);
    });
};
/** Main Program
 ******************************************************************************/
getWeatherData("Toronto");
