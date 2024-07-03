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

    // TOGGLE

    const body = document.querySelector('body');
    const switchInput = document.querySelector('.js-switch-input');

    switchInput.addEventListener('change', switchInputChecked);

const Theme = {
  LIGHT: 'light-theme',
  DARK: 'dark-theme',
};

function switchInputChecked() {
  const currentTheme = localStorage.getItem('theme'); //  checks the current theme stored in localStorage
  if (currentTheme === Theme.LIGHT) {                 // if the current theme is light (Theme.LIGHT), it switches to dark: adds the dark-theme class to the body
    body.classList.add(Theme.DARK);
    localStorage.setItem('theme', Theme.DARK);
  } else {                                          // if the current theme is dark or not set, it switches to light: Removes the dark-theme class from the body
    body.classList.remove(Theme.DARK);
    localStorage.setItem('theme', Theme.LIGHT);
  }
}

function checkedTheme() {                           // checkedTheme is a function that runs when the page loads. It retrieves the theme from localStorage.
  const theme = localStorage.getItem('theme');      // If no theme is set, it defaults to light (Theme.LIGHT) and stores this in localStorage.
  

  if (!theme) {
    localStorage.setItem('theme', Theme.LIGHT);
  }

  if (theme === Theme.DARK) {
    body.classList.add(Theme.DARK);
    switchInput.checked = true;
  }

  if (theme === Theme.LIGHT) {
    body.classList.add(Theme.LIGHT);
  }
}
checkedTheme();