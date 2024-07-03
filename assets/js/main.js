const apiKey = "d7ed66de4c75e0cfa7a7fc5f53ba13f5";
const units = "metric";

const cityNameElement = document.getElementById("city-name");
const currTempElement = document.getElementById("curr-temp");
const currConditionElement = document.getElementById("curr-condition");
const currConditionImageElement = document.getElementById("curr-condition-img");
const cityInputElement = document.getElementById("city-input");
const submitButtonElement = document.getElementById("submit-button");
const forecastAreaElement = document.getElementById("forecast-area");
const spinnerElement = document.getElementById("spinner");


submitButtonElement.addEventListener('click', handleButtonClick);


function handleButtonClick() {
    const cityName = cityInputElement.value;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=${units}`;

    // Show the spinner
    spinnerElement.style.display = 'block';

    fetch(url)
        .then(function (response) {
            if (!response.ok) {
                throw new Error(`Error in weather data`);
            }
            return response.json();
        })
        .then(function (data) {
            forecastAreaElement.innerHTML = "";

            const cityName = data.city.name;
            cityNameElement.innerText = cityName;

            const currentCondition = data.list[0].weather[0].main;
            currConditionElement.innerText = currentCondition;

            const currentConditionImageCode = data.list[0].weather[0].icon;
            const currConditionImage = `https://openweathermap.org/img/wn/${currentConditionImageCode}@2x.png`;
            currConditionImageElement.src = currConditionImage;

            const currentTemp = Math.round(data.list[0].main.temp);
            currTempElement.innerText = currentTemp;
        
            for (let i = 7; i < 40; i+=8) {
                const currentCondition = data.list[i].weather[0].main;
                const currentConditionImageCode = data.list[i].weather[0].icon;
                const currConditionImage = `https://openweathermap.org/img/wn/${currentConditionImageCode}@2x.png`;
                const currentTemp = Math.round(data.list[i].main.temp);

                const timeStamp = data.list[i].dt;
                const dayOfWeek = new Date(timeStamp * 1000).toLocaleDateString("en-GB", { weekday: 'long' });

                const htmlString = `
                    <div class="col">
                        <h3>${dayOfWeek}</h3>
                        <img src="${currConditionImage}">
                        <h3>${currentCondition}</h3>
                        <h4>${currentTemp}°C</h4>
                    </div>
                `;
                forecastAreaElement.innerHTML += htmlString;
            }
            // Hide the spinner
            spinnerElement.style.display = 'none';
        
        })
        .catch(function (error) {
            // Hide the spinner
            spinnerElement.style.display = 'none';
            alert.error(`Failed to retrieve weather data: ${error.message}`);
        });
}

// Steve's code for autolocation added seperately bacuase api call is a different format
const autoLocateButton = document.getElementById("auto-location");

autoLocateButton.addEventListener('click', handleAutoClick);

function handleAutoClick() {
    // Function to handle errors in geolocation retrieval
    function geolocationError(error) {
        console.error('Error getting geolocation:', error);
    }

    // Get user's location using Geolocation API
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);
    } else {
        console.log('Geolocation is not available in this browser.');
    }

    function geolocationSuccess(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const url2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
    console.log(`latitude: ${lat}`)
	console.log(`longitude: ${lon}`)
    console.log(`url2: ${url2}`)
    
    // old url: `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=${units}`;
    
    // api call as given in documentation: api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}&units=${units}

        fetch(url2)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                forecastAreaElement.innerHTML = "";

                const cityName = data.city.name;
                cityNameElement.innerText = cityName;

                const currentCondition = data.list[0].weather[0].main;
                currConditionElement.innerText = currentCondition;

                const currentConditionImageCode = data.list[0].weather[0].icon;
                const currConditionImage = `https://openweathermap.org/img/wn/${currentConditionImageCode}@2x.png`;
                currConditionImageElement.src = currConditionImage;

                const currentTemp = Math.round(data.list[0].main.temp);
                currTempElement.innerText = currentTemp;
            
                for (let i = 7; i < 40; i+=8) {
                    const currentCondition = data.list[i].weather[0].main;
                    const currentConditionImageCode = data.list[i].weather[0].icon;
                    const currConditionImage = `https://openweathermap.org/img/wn/${currentConditionImageCode}@2x.png`;
                    const currentTemp = Math.round(data.list[i].main.temp);

                    const timeStamp = data.list[i].dt;
                    const dayOfWeek = new Date(timeStamp * 1000).toLocaleDateString("en-GB", { weekday: 'long' });

                    const htmlString = `
                        <div class="col">
                            <h3>${dayOfWeek}</h3>
                            <img src="${currConditionImage}">
                            <h3>${currentCondition}</h3>
                            <h4>${currentTemp}°C</h4>
                        </div>
                    `;
                    forecastAreaElement.innerHTML += htmlString;
                }
            
            
            });
        }
}
