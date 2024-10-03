let url1 = "https://nominatim.openstreetmap.org/search?addressdetails=1&q=";
let url2 = "https://api.open-meteo.com/v1/forecast?latitude=";
let url2_a = "&longitude=";
let url2_b = "&hourly=temperature_2m&forecast_days=1";
let btn = document.querySelector("button");

btn.addEventListener("click", async () => {
    let city = document.querySelector("input").value;

    // get latitude and longitude 
    let ll = await getLL(city);
    let para = document.querySelector("#para");
    // para.innerText = "";
    // para.innerText = `${ll.lat}, ${ll.lon}`;

    let latitude = ll.lat;
    let longitude = ll.lon;


    // get weather
    let currentTemp = await getWeather(latitude, longitude);
    let weather = document.querySelector("#result");
    weather.innerText = "";
    weather.innerText += `\nCurrent Temperature: ${currentTemp}°C`;
    // console.log(weather);
   
});



async function getWeather(latitude, longitude) {
    
    try {
        let res2 = await axios.get(url2 + latitude + url2_a + longitude + url2_b);
        let weatherData = res2.data;

        // Get current time in the city's timezone
        let cityTime = new Date().toLocaleString("en-US", { timeZone: weatherData.timezone });
        let cityDate = new Date(cityTime);

        // Find the closest matching time in the weather data
        let closestTimeIndex = weatherData.hourly.time.findIndex(time => {
            let weatherDate = new Date(time);
            return weatherDate.getHours() === cityDate.getHours() && weatherDate.getDate() === cityDate.getDate();
        });
        console.log(closestTimeIndex);

        
        
        return weatherData.hourly.temperature_2m[closestTimeIndex];
    } catch(e) {
        console.log("error -", e);
    }
}



async function getLL(city) {
    try {
        let response = await axios.get(url1 + city + "&format=jsonv2&limit=1");
        // console.log("LAT and LON");
        // console.log(response.data);
        // console.log(response.data[0]);
        return response.data[0];
    } catch (e) {
        console.log("error -", e);
        return [];
    }

}