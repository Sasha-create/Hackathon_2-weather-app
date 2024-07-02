const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY ='49cc8c821cd2aff9af04c9f98c36eb74';


const apiKey = "7816d9f235c88adc096427a68ca872f2";
const units = "metric";

const cityNameElement = document.getElementById("city-name");
const currTempElement = document.getElementById("curr-temp");
const currConditionElement = document.getElementById("curr-condition");
const currConditionImageElement = document.getElementById("curr-condition-img");
const cityInputElement = document.getElementById("mobileSearchCity");
const submitButtonElement = document.getElementById("submit-button");
const forecastAreaElement = document.getElementById("forecast-area");

const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');



setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
    const minutes = time.getMinutes();
    const ampm = hour >=12 ? 'PM' : 'AM'

    timeEl.innerHTML = (hoursIn12HrFormat < 10? '0'+hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10? '0'+minutes: minutes)+ ' ' + `<span id="am-pm">${ampm}</span>`

    dateEl.innerHTML = days[day] + ', ' + date+ ' ' + months[month]

}, 1000);

getWeatherData()
function getWeatherData () {
    navigator.geolocation.getCurrentPosition((success) => {
        
        let {latitude, longitude } = success.coords;
        

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
           
      
        console.log(data)
        showWeatherData(data);
        })

    })
}

function showWeatherData (data){
    let {humidity, pressure, sunrise, sunset, wind_speed} = data.current;

    timezone.innerHTML = data.timezone;
    countryEl.innerHTML = data.lat + 'N ' + data.lon+'E'

  

    let otherDayForcast = ''
    data.daily.forEach((day, idx) => {
        if(idx == 0){
            currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            
            `
        }else{
            otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            
            `
        }
    })

    weatherForecastEl.innerHTML = otherDayForcast;
}

submitButtonElement.addEventListener('click', handleButtonClick);


function handleButtonClick() {
    const cityName = cityInputElement.value;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=${units}`;

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
          
            weatherForecastEl.innerHTML = "";

            const cityName = data.city.name;
            cityNameElement.innerText = cityName;

            const currentCondition = data.list[0].weather[0].main;
             currConditionElement.innerText = currentCondition;

            const currentConditionImageCode = data.list[0].weather[0].icon;
            const currConditionImage = `https://openweathermap.org/img/wn/${currentConditionImageCode}@2x.png`;
            currConditionImageElement.src = currConditionImage;

            const currentTemp = data.list[0].main.temp;
            const realFeel =  data.list[0].main.feels_like;
            //const timezone =  data.timezone;

            //const windSpeed = data.wind.speed;
           // const windDirection = data.wind.deg;
            //const visibility = data.visibility / 1000;
            const pressure = data.list[0].main.pressure;
            const maxTemperature = data.list[0].main.temp_max;
            const minTemperature = data.list[0].main.temp_min;
            const humidity = data.list[0].main.humidity;
            //const sunrise = data.sys.sunrise;
            //const sunset = data.sys.sunset;

            document.getElementById("temperatureValue").innerHTML = currentTemp + "<sup>o</sup>C";
            document.getElementById("realFeelAdditionalValue").innerHTML = realFeel + "<sup>o</sup>C";

            //document.getElementById("windSpeedAdditionalValue").innerHTML = windSpeed + " km/h";
           // document.getElementById("windDirectionAdditionalValue").innerHTML = windDirection;
            //document.getElementById("visibilityAdditionalValue").innerHTML = visibility + " km";
            document.getElementById("pressureAdditionalValue").innerHTML = pressure;
            document.getElementById("maxTemperatureAdditionalValue").innerHTML = maxTemperature + "<sup>o</sup>C";
            document.getElementById("minTemperatureAdditionalValue").innerHTML = minTemperature + "<sup>o</sup>C";
            
            document.getElementById("humidityAdditionalValue").innerHTML = humidity;


            //document.getElementById("time-zone").innerHTML = timezone;
           // document.getElementById("sunriseAdditionalValue").innerHTML = sunrise;
           // document.getElementById("sunsetAdditionalValue").innerHTML = sunset;
        
            currTempElement.innerText = currentTemp;
        
            for (let i = 7; i < 40; i+=8) {
                const currentCondition = data.list[i].weather[0].main;
                const weatherDescription = data.list[i].weather[0].description;
                const currentConditionImageCode = data.list[i].weather[0].icon;
                const currConditionImage = `https://openweathermap.org/img/wn/${currentConditionImageCode}@2x.png`;
                const currentTemp = data.list[i].main.temp;
                const humidity = data.list[i].main.humidity;
                const windSpeed = data.list[i].wind.speed;
                const timeStamp = data.list[i].dt;
                const dayOfWeek = new Date(timeStamp * 1000).toLocaleDateString("en-GB", { weekday: 'long' });

                const htmlString = `
                <div class="weather-forecast-item">
                        <h3>${dayOfWeek}</h3>
                        <h3>${weatherDescription}</h3>
                        <img src="${currConditionImage}">
                        <h3>${currentCondition}</h3>
                        <h4>${currentTemp}°C</h4>
                        <h4>Humidity:${humidity}°C</h4>
                        <h4>Wind Speed: ${windSpeed} m/s<h4>
                    </div>
                `;

                currentTempEl.style.display='none';
                weatherForecastEl.innerHTML += htmlString;
            }
        
        
        });
}

