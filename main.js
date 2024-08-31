const apiKey = 'API_KEY';
const apiBase = 'https://api.openweathermap.org/data/2.5';

function getWeather() {
    const location = document.getElementById('location').value;
    if (!location) return;

    fetch(`${apiBase}/weather?q=${location}&units=metric&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
            return fetch(`${apiBase}/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=hourly,minutely,alerts&units=metric&appid=${apiKey}`);
        })
        .then(response => response.json())
        .then(data => displayForecast(data))
        .catch(error => console.error('Error fetching weather data:', error));
}

function displayCurrentWeather(data) {
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
    
    document.getElementById('weather-icon').src = iconUrl;
    document.getElementById('weather-icon').alt = data.weather[0].description;
    document.getElementById('current-temp').innerText = `Temperature: ${Math.round(data.main.temp)}°C`;
    document.getElementById('current-uv').innerText = `UV Index: ${data.main.uvi}`;
    document.getElementById('current-precip').innerText = `Precipitation: ${Math.round(data.rain ? data.rain['1h'] : 0)}%`;
}

function displayForecast(data) {
    const forecastList = document.getElementById('forecast-list');
    

    data.daily.forEach(day => {
        const iconCode = day.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const listItem = document.createElement('div');
        listItem.className = 'card';
        listItem.innerHTML = `
            <img src="${iconUrl}" alt="${day.weather[0].description}">
            <div>
                <strong>${new Date(day.dt * 1000).toLocaleDateString()}</strong><br>
                High: ${Math.round(day.temp.max)}°C<br>
                Low: ${Math.round(day.temp.min)}°C<br>
                Precipitation: ${Math.round(day.pop * 100)}%<br>
            </div>
        `;
        forecastList.appendChild(listItem);
    });
}
