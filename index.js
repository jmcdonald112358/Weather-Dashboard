//Global variables
   //Fetch recent searches from local storage or create empty array to store a new search
   var recentSearchesArr = JSON.parse(localStorage.getItem("recentSearchesArr")) || [];

   //Hardcoded currentCityObj for testing -- remove before submitting
   var currentCityObj = {
      city: "Salt Lake City, Ut",
      temp: "29",
      humidity: "42%",
      wind: "7 MPH",
      uvi: "0",
      forecast: [
      {
         date: "Jan 22, 2021",
         temp_high: "45",
         temp_low: "27",
         humidity: "30%",
         uvi: "3"
      },
      {
         date: "Jan 23, 2021",
         temp_high: "46",
         temp_low: "28",
         humidity: "31%",
         uvi: "4"
      },
      {
         date: "Jan 24, 2021",
         temp_high: "47",
         temp_low: "29",
         humidity: "32%",
         uvi: "6"
      },
      {
         date: "Jan 25, 2021",
         temp_high: "48",
         temp_low: "30",
         humidity: "33%",
         uvi: "7"
      },
      {
         date: "Jan 26, 2021",
         temp_high: "49",
         temp_low: "31",
         humidity: "34%",
         uvi: "9"
      }
      ]
   };

   //Log currentCityObj for reference -- remove before submitting
   console.log(currentCityObj);

   //Hardcoded forecast array of objects for testing
   // var forecast = ;

//Function to generate recent searches table
function recentSearches(){

   //Remove placeholder text
   $("#recentsPlaceholder").remove();

   //Create table
   let recentsList = $("<table>").addClass("table is-hoverable is-fullwidth has-background-grey has-text-white-ter").attr("id", "recentsList");
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

   //WTF... If I clear the list, it comes back when I input the next query??? What am I missing here? I can watch local storage get emptied, but then it brings everything back on the next search? Huh??? After refreshing after the clear, then it's fine, but what??
   $("#clearRecent").click(function(){
      localStorage.clear(recentSearchesArr);
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
   recentSearchesArr.push(searchQuery);
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
   let APIKey = "18fd9d17fe77b197fb6834a10bce994b";
   
   let basicQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=imperial&appid=" + APIKey;

   // let detailedQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&exclude=hourly&appid=" + APIKey;

   //Get basic city data
   $.ajax({
      url: basicQueryURL,
      method: "GET"
   }).then(function(basicResponse){
      console.log(basicResponse);

      //Store relevant lat/lon data from response to pipe into detailed function
   })
   
   //Get detailed city data
   // $.ajax({
   //    url: detailedQueryURL,
   //    method: "GET"
   // }).then(function(detailedResponse){
   //    console.log(detailedResponse);
   
         //Generate currentCityObj with relevant response data for current conditions and forecast

   // })


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

   //Populate forecast card
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

      let forecastItem = $("<td>").attr("id", iterationCell);
      $("#forecastRow").append(forecastItem);

      let forecastCard = $("<div>").addClass("card has-background-info").attr("id", iterationCard);
      $("#" + iterationCell).append(forecastCard);

      let forecastContent = $("<div>").addClass("card-content").attr("id", iterationContent);
      $("#" + iterationCard).append(forecastContent);

      let iterationDate = $("<p>").addClass("is-size-5 pb-3").text(currentCityObj.forecast[i].date);
      //Forecast icon goes here
      let iterationTempHigh = $("<p>").addClass("is-size-7 pb-3").text("High: " + currentCityObj.forecast[i].temp_high + " *F");
      let iterationTempLow = $("<p>").addClass("is-size-7 pb-3").text("Low: " + currentCityObj.forecast[i].temp_low + " *F");
      let iterationHumidity = $("<p>").addClass("is-size-7 pb-3").text("Humidity: " + currentCityObj.forecast[i].humidity);
      let iterationUVI = $("<p>").addClass("is-size-7").text("UV Index: " + currentCityObj.forecast[i].uvi);

      $("#" + iterationContent).append(iterationDate, iterationTempHigh, iterationTempLow, iterationHumidity, iterationUVI);
   }
};

// cityDetails();