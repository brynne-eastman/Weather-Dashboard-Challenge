//Open weather API key
let myAPIId = "ec1382591f2eafe4112be140af974ad6"

function createCityList(citySearchList) {
  $("#cityList").empty();

  let keys = Object.keys(citySearchList);
  for (let i = 0; i < keys.length; i++) {
    let cityListEntry = $("<button>");
    cityListEntry.addClass("list-group-item list-group-item-action");

    let str = keys[i].toLowerCase().split(" ");
    for (let j = 0; j < str.length; j++) {
      str[j] = str[j].charAt(0).toUpperCase() + str[j].substring(1);
    }
    let titledCity = str.join(" ");
    cityListEntry.text(titledCity);

    $("#cityList").append(cityListEntry);
  }
}

function showWeather(city, citySearchList) {
  createCityList(citySearchList);

  let queryURL1 = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&appid=" + myAPIId;

  let queryURL2 = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial" + "&appid=" + myAPIId;

  $.ajax({
    url: queryURL1,
    method: "GET"
  })
    //Weather response
    .then(function(response) {

      let currentMoment = moment();

      let showMoment = $("<h3>");
      $("#city-name").empty();
      $("#city-name").append(
        showMoment.text("(" + currentMoment.format("M/D/YYYY") + ")")
      );

      let cityName = $("<h3>").text(response.name);
      $("#city-name").prepend(cityName);

      let weatherIcon = $("<img>");
      weatherIcon.attr(
        "src", "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png");

      $("#current-icon").empty();
      $("#current-icon").append(weatherIcon);

      $("#temp").text("Temperature: " + response.main.temp + " °F");
      $("#humidity").text("Humidity: " + response.main.humidity + "%");
      $("#wind").text("Wind Speed: " + response.wind.speed + " MPH");

      let lat = response.coord.lat;
      let lon = response.coord.long;
      let uvQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + "lat=" + lat + "&lon=" + lon + "&units=imperial" + "&appid=" + myAPIId;

      $.ajax({
        url: uvQueryURL,
        method: "GET"
     //UV Index
      }).then(function(uvIndex) {
  
        let showUvIndex = $("<button>");
        showUvIndex.addClass("btn btn-uvDanger");

        $.ajax({
          url: queryURL2,
          method: "GET"
        //Forecast
        }).then(function(forecast) {
          
          for (let i = 6; i < forecast.list.length; i += 8) {
            
            let date = $("<h5>");

            let forecastPosition = (i + 2) / 8;

            $("#date" + forecastPosition).empty();
            $("#date" + forecastPosition).append(
              date.text(currentMoment.add(1, "days").format("M/D/YYYY"))
            );

            let forecastIcon = $("<img>");
            forecastIcon.attr(
              "src", "https://openweathermap.org/img/w/" + forecast.list[i].response[0].icon + ".png"
            );

            $("#forecast-icon" + forecastPosition).empty();
            $("#forecast-icon" + forecastPosition).append(forecastIcon);


            $("#forecast-temp" + forecastPosition).text("Temp: " + forecast.list[i].main.temp + " °F");
            $("#forecast-humidity" + forecastPosition).text("Humidity: " + forecast.list[i].main.humidity + "%");
          }
        });
      });
    });
}

$(document).ready(function() {

    let citySearchListStringified = localStorage.getItem("citySearchList");

    let citySearchList = JSON.parse(citySearchListStringified);  

  createCityList(citySearchList);

  $("#search-button").on("click", function(event) {
    event.preventDefault();
    let city = $("#city-input")
      .val()

    if (city != "") {
  
    
    citySearchList[city] = true;
    localStorage.setItem("citySearchList", JSON.stringify(citySearchList));

    showWeather(city, citySearchList);

    $("#current-weather").show();
    $("#5day-forecast").show();
    }
  });

  $("#cityList").on("click", "button", function(event) {
    event.preventDefault();
    let city = $(this).text();

    showWeather(city, citySearchList);

    $("#current-weather").show();
   
  })
})