//Global variables
   //Fetch recent searches from local storage or create empty array to store a new search
   var recentSearchesArr = JSON.parse(localStorage.getItem("recentSearchesArr")) || [];

   //Hardcoded currentCityObj for testing -- remove before submitting
   // var currentCityObj = {
   //    city: "Salt Lake City, Ut",
   //    temp: "29",
   //    humidity: "42%",
   //    wind: "7 MPH",
   //    uvi: "0",
   //    forecast: [
   //    {
   //       date: "Jan 22, 2021",
   //       temp_high: "45",
   //       temp_low: "27",
   //       humidity: "30%",
   //       uvi: "3"
   //    },
   //    {
   //       date: "Jan 23, 2021",
   //       temp_high: "46",
   //       temp_low: "28",
   //       humidity: "31%",
   //       uvi: "4"
   //    },
   //    {
   //       date: "Jan 24, 2021",
   //       temp_high: "47",
   //       temp_low: "29",
   //       humidity: "32%",
   //       uvi: "6"
   //    },
   //    {
   //       date: "Jan 25, 2021",
   //       temp_high: "48",
   //       temp_low: "30",
   //       humidity: "33%",
   //       uvi: "7"
   //    },
   //    {
   //       date: "Jan 26, 2021",
   //       temp_high: "49",
   //       temp_low: "31",
   //       humidity: "34%",
   //       uvi: "9"
   //    }
   //    ]
   // };

   var currentCityObj = {};

   //Log currentCityObj for reference -- remove before submitting
   console.log(currentCityObj);

   //Hardcoded forecast array of objects for testing
   // var forecast = ;

//Function to generate recent searches table
function recentSearches(){

   //Remove placeholder text
   $("#recentsPlaceholder").remove();

   //Create table
   let recentsList = $("<table>").addClass("table is-hoverable is-fullwidth has-background-grey has-text-white-ter").attr("id", "recentsList").attr("style", "");
   $("#searchCard").append(recentsList);

   let recentsBody = $("<tbody>");
   $("#recentsList").append(recentsBody);

   //Add list items
   for (let i = recentSearchesArr.length - 1; i >= 0; i--){
      let recentCity = recentSearchesArr[i];
      let recentItem = $("<td>").text(recentCity);
      let recentRow = $("<tr>").attr("id", "recentCity").append(recentItem);
      $("tbody").append(recentRow);
   }

   //Show button to clear recent searches from localstorage
   let clearRecent = $("<a>").addClass("button is-rounded is-danger").attr("type", "submit").attr("value", "Clear").attr("id", "clearRecent").text("Clear");
   $("#searchCard").append(clearRecent);

   let resetRecents = $("<div>").addClass("has-text-white-ter").attr("style", "font-style: italic; font-size: small;").attr("id", "recentsPlaceholder").text("No recent searches...");

   $("#clearRecent").click(function(){
      localStorage.clear();
      recentSearchesArr = [];
      $("#recentsList").remove();
      $("#clearRecent").remove();
      $("#searchCard").append(resetRecents);
   });
   
};

//Generate list of recent searches if present
if (recentSearchesArr.length > 0){
   recentSearches();
}


//Event listener for new search
$("#submitSearch").click(function(event){
   
   event.preventDefault();

   //Store input to feed into function
   let searchQuery = $("#searchInput").val().trim();
   recentSearchesArr.push(searchQuery); //push response from API name instead
   localStorage.setItem("recentSearchesArr", JSON.stringify(recentSearchesArr));

   //Reset search field
   $("#searchInput").val('');

   //Execute cityDetails function for the queried city
   cityDetails(searchQuery);

   //Regenerate recent searches list to show the new query at the top of the list
   $("#recentsList").remove();
   $("#clearRecent").remove();
   recentSearches();
})


//Event listener for recent search click 
//****need to update recentsList items to be buttons for this to work****
$("#recentCity").click(function(event){

   //Get content of the cell to pipe into search function
   event.preventDefault();
   let recentQuery = $(this).val();

   //Execute cityDetails function
   cityDetails(recentQuery);
})


//Function to generate current/forecast for the searched city
function cityDetails(query){

   //Clear current city if a search has been made
   $("#cityDetails").empty();

   //Remove placeholder text if present
   $("#cityPlaceholder").remove();


   //API calls

   //Get basic city data
   let basicQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=imperial&appid=744b8a1c38782a64532ea34b2848c13f";

   $.ajax({
      url: basicQueryURL,
      method: "GET"
   }).then(function(basicResponse){
      console.log(basicResponse);

      //Store relevant lat/lon data from response to pipe into detailed function
      let cityLat = basicResponse.coord.lat;
      let cityLon = basicResponse.coord.lon;

      //Update currentCityObj with relevant response data
      currentCityObj.city = JSON.stringify(basicResponse.name);
      console.log("After basic API: " + currentCityObj);

      // Get detailed city data
      let detailedQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&units=imperial&exclude=hourly&appid=744b8a1c38782a64532ea34b2848c13f";
         
      $.ajax({
         url: detailedQueryURL,
         method: "GET"
      }).then(function(detailedResponse){
         console.log(detailedResponse);

         //Update currentCityObj with relevant response data   
         currentCityObj.temp = detailedResponse.current.temp +" *F";
         currentCityObj.feels_like = detailedResponse.current.feels_like + " *F";
         currentCityObj.humidity = detailedResponse.current.humidity + "%";
         currentCityObj.wind = detailedResponse.current.wind_speed + " MPH";
         currentCityObj.uvi = detailedResponse.current.uvi; 
         currentCityObj.forecast = [];

         //Loop to create forecast objects and push into forecast array
         for (i = 0; i < 5; i++) {
            // let iterationDate = detailedResponse.daily.i.dt;
            // let iterationTempHigh = detailedResponse.daily.i.temp.max + "F";
            // let iterationTempLow = detailedResponse.daily.i.temp.min +"F";
            // let iterationHumidity = detailedResponse.daily.i.humidity + "%";
            // let iterationUVI = detailedResponse.daily.i.uvi;

            // let iterationForecast = {
            //    date: iterationDate,
            //    temp_high: iterationTempHigh,
            //    temp_low: iterationTempLow,
            //    humidity: iterationHumidity,
            //    uvi: iterationUVI
            // }

            let iterationForecast = {
               date: moment.unix(detailedResponse.daily[i].dt).format("MMMM DD, YYYY"),
               temp_high: detailedResponse.daily[i].temp.max + " *F",
               temp_low: detailedResponse.daily[i].temp.min +" *F",
               humidity: detailedResponse.daily[i].humidity + "%",
               uvi: detailedResponse.daily[i].uvi
            }

            currentCityObj.forecast.push(iterationForecast);
            console.log(currentCityObj.forecast);
         }
         console.log("After detailed API: " + currentCityObj);

         
         //Populate current conditions card
         let currentMain = $("<div>").addClass("card").attr("id", "currentCondCard");
         $("#cityDetails").append(currentMain);
         
         let currentCondCont = $("<div>").addClass("card-content has-background-grey").attr("id", "currentConditions");
         $("#currentCondCard").append(currentCondCont);
         
         let cityName = $("<p>").addClass("title pb-3").text("Current conditions for " + currentCityObj.city);
         let cityTemp = $("<p>").addClass("subtitle").text("Temperature: " + currentCityObj.temp);
         let cityHum = $("<p>").addClass("subtitle").text("Humidity: " + currentCityObj.humidity);
         let cityWind = $("<p>").addClass("subtitle").text("Wind Speed: " + currentCityObj.wind);
         let cityUv = $("<p>").addClass("subtitle").text("UV Index: " + currentCityObj.uvi);
         
         $("#currentConditions").append(cityName, cityTemp, cityHum, cityWind, cityUv);
         
         // Populate forecast card
         let forecastLabel = $("<p>").addClass("title mt-6").text("5-day Forecast:");
         $("#cityDetails").append(forecastLabel);

         let forecastContainer = $("<div>").addClass("table-container").attr("id", "forecastMain");
         $("#cityDetails").append(forecastContainer);

         let forecastTable = $("<table>").addClass("table has-background-grey-dark has-text-centered").attr("id", "forecastTable");
         $(".table-container").append(forecastTable);

         let forecastRow = $("<tr>").attr("id", "forecastRow");
         $("#forecastTable").append(forecastRow);

         for (i = 0; i < 5; i++){
            let iterationCell = "day" + i;
            let iterationCard = "card" + i;
            let iterationContent = "content" + i;

            let forecastItem = $("<td>").attr("id", iterationCell).attr("style", "border: none;");
            $("#forecastRow").append(forecastItem);

            let forecastCard = $("<div>").addClass("card has-background-info").attr("id", iterationCard);
            $("#" + iterationCell).append(forecastCard);

            let forecastContent = $("<div>").addClass("card-content").attr("id", iterationContent);
            $("#" + iterationCard).append(forecastContent);

            let iterationDate = $("<p>").addClass("is-size-5 pb-3").text(currentCityObj.forecast[i].date);
            //Forecast icon goes here
            let iterationTempHigh = $("<p>").addClass("is-size-7 pb-3").text("High: " + currentCityObj.forecast[i].temp_high);
            let iterationTempLow = $("<p>").addClass("is-size-7 pb-3").text("Low: " + currentCityObj.forecast[i].temp_low);
            let iterationHumidity = $("<p>").addClass("is-size-7 pb-3").text("Humidity: " + currentCityObj.forecast[i].humidity);
            let iterationUVI = $("<p>").addClass("is-size-7").text("UV Index: " + currentCityObj.forecast[i].uvi);

            $("#" + iterationContent).append(iterationDate, iterationTempHigh, iterationTempLow, iterationHumidity, iterationUVI);
         };
      });
   });

   
};

// cityDetails();