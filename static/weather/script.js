document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const city = document.getElementById('cityInput').value;
    const errorDiv = document.getElementById('errorMessage');
    const searchBtn = document.querySelector('button[type="submit"]');
    const searchBtnText = document.getElementById('searchBtnText');
    const searchSpinner = document.getElementById('searchSpinner');
    
    // Clear previous error message
    errorDiv.classList.add('d-none');
    
    // Show loading state
    searchBtn.disabled = true;
    searchBtnText.classList.add('d-none');
    searchSpinner.classList.remove('d-none');
    
    try {
        const response = await fetch('/api/weather', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ city: city })
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayWeather(data.current, data.forecast);
            document.getElementById('welcomeMessage').classList.add('d-none');
            document.getElementById('weatherContainer').classList.remove('d-none');
        } else {
            showError(data.error || 'An error occurred while fetching weather data');
        }
    } catch (error) {
        showError('Failed to fetch weather data. Please check your connection.');
        console.error('Error:', error);
    } finally {
        // Hide loading state
        searchBtn.disabled = false;
        searchBtnText.classList.remove('d-none');
        searchSpinner.classList.add('d-none');
    }
});

// Weather code to emoji mapping
const weatherEmojiMap = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '🌤️',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️'
};

function getWeatherEmoji(iconCode) {
    return weatherEmojiMap[iconCode] || '🌞';
}

function displayWeather(current, forecast) {
    // Update current weather with state if available
    let cityDisplay = current.city;
    if (current.state) {
        cityDisplay += `, ${current.state}`;
    }
    cityDisplay += `, ${current.country}`;
    
    document.getElementById('cityName').textContent = cityDisplay;
    document.getElementById('temperature').innerHTML = `${current.temperature_c}°C / ${current.temperature_f}°F`;
    document.getElementById('feelsLikeTemp').innerHTML = `${current.feels_like_c}°C / ${current.feels_like_f}°F`;
    document.getElementById('weatherDescription').textContent = current.description;
    document.getElementById('humidity').textContent = current.humidity;
    document.getElementById('windSpeed').textContent = current.wind_speed;
    document.getElementById('pressure').textContent = current.pressure;
    document.getElementById('cloudiness').textContent = current.cloudiness;
    
    // Set weather emoji icon
    const weatherEmoji = getWeatherEmoji(current.icon);
    document.getElementById('weatherIcon').textContent = weatherEmoji;
    
    // Display forecast
    const forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = '';
    
    forecast.forEach((day, index) => {
        const forecastEmoji = getWeatherEmoji(day.icon);
        const forecastCard = document.createElement('div');
        forecastCard.className = 'col-12 col-sm-6 col-md-4 col-lg-auto';
        forecastCard.innerHTML = `
            <div class="forecast-card" style="animation-delay: ${index * 0.1}s">
                <div class="forecast-date">${formatDate(day.date)}</div>
                <div class="forecast-emoji">${forecastEmoji}</div>
                <div class="forecast-temp">${day.temp_max_c}°C / ${day.temp_max_f}°F</div>
                <div class="forecast-temp-range">${day.temp_min_c}°C / ${day.temp_min_f}°F | ${day.description}</div>
                <div class="forecast-description">
                    <small>💧 ${day.humidity}% | 💨 ${day.wind_speed}m/s</small>
                </div>
            </div>
        `;
        forecastContainer.appendChild(forecastCard);
    });
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.classList.remove('d-none');
}

function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Allow Enter key to search (already handled by form submit, but good for UX)
document.getElementById('cityInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('searchForm').dispatchEvent(new Event('submit'));
    }
});