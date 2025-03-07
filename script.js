// Your API key from WeatherAPI.com
const API_KEY = 'd411fcd56ee54e5caec160828250703';
const BASE_URL = 'https://api.weatherapi.com/v1';

// Function to fetch weather data
async function fetchWeatherData() {
    try {
        // Fetch forecast data for 3 days using IP-based location
        const response = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=auto:ip&days=3`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        
        const data = await response.json();
        
        // Update location
        document.getElementById('location').textContent = `${data.location.name}, ${data.location.region}, ${data.location.country}`;
        
        // Display current weather
        displayCurrentWeather(data.current);
        
        // Display forecast
        displayForecast(data.forecast.forecastday);
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('location').textContent = 'Unable to fetch weather data. Please try again later.';
    }
}

// Function to get weather type for animations
function getWeatherType(condition) {
    const code = condition.code;
    const text = condition.text.toLowerCase();
    
    // Check for rain conditions
    if (text.includes('rain') || text.includes('drizzle') || text.includes('shower')) {
        return 'rainy';
    }
    
    // Check for snow conditions
    if (text.includes('snow') || text.includes('blizzard') || text.includes('sleet')) {
        return 'snowy';
    }
    
    // Check for windy conditions
    if (text.includes('wind') || text.includes('gale') || code === 1030 || code === 1135 || code === 1147) {
        return 'windy';
    }
    
    // Default to sunny for clear or partly cloudy conditions
    return 'sunny';
}

// Function to create weather animation elements
function createWeatherAnimation(type, container) {
    const animationContainer = document.createElement('div');
    animationContainer.className = 'animation-container';
    
    switch(type) {
        case 'sunny':
            const sun = document.createElement('div');
            sun.className = 'sun';
            animationContainer.appendChild(sun);
            
            // Add sun rays
            for (let i = 0; i < 8; i++) {
                const ray = document.createElement('div');
                ray.className = 'ray';
                ray.style.transformOrigin = 'bottom center';
                ray.style.transform = `rotate(${i * 45}deg)`;
                ray.style.left = '50%';
                ray.style.marginLeft = '-1px';
                ray.style.top = '20px';
                animationContainer.appendChild(ray);
            }
            break;
            
        case 'rainy':
            const rainCloud = document.createElement('div');
            rainCloud.className = 'cloud';
            animationContainer.appendChild(rainCloud);
            
            // Add raindrops
            for (let i = 0; i < 20; i++) {
                const rain = document.createElement('div');
                rain.className = 'rain';
                rain.style.left = `${Math.random() * 100}%`;
                rain.style.animationDelay = `${Math.random() * 1.5}s`;
                rain.style.opacity = Math.random();
                animationContainer.appendChild(rain);
            }
            break;
            
        case 'windy':
            const windyCloud = document.createElement('div');
            windyCloud.className = 'cloud';
            animationContainer.appendChild(windyCloud);
            
            // Add wind lines
            for (let i = 0; i < 10; i++) {
                const windLine = document.createElement('div');
                windLine.className = 'wind-line';
                windLine.style.width = `${30 + Math.random() * 70}px`;
                windLine.style.top = `${120 + i * 15}px`;
                windLine.style.animationDelay = `${Math.random() * 3}s`;
                windLine.style.opacity = 0.3 + Math.random() * 0.7;
                animationContainer.appendChild(windLine);
            }
            break;
            
        case 'snowy':
            const snowCloud = document.createElement('div');
            snowCloud.className = 'cloud';
            animationContainer.appendChild(snowCloud);
            
            // Add snowflakes
            for (let i = 0; i < 30; i++) {
                const snowflake = document.createElement('div');
                snowflake.className = 'snowflake';
                snowflake.style.left = `${Math.random() * 100}%`;
                snowflake.style.animationDelay = `${Math.random() * 5}s`;
                snowflake.style.opacity = 0.7 + Math.random() * 0.3;
                snowflake.style.width = `${3 + Math.random() * 5}px`;
                snowflake.style.height = snowflake.style.width;
                animationContainer.appendChild(snowflake);
            }
            break;
    }
    
    container.appendChild(animationContainer);
}

// Function to display current weather
function displayCurrentWeather(current) {
    const container = document.getElementById('current-weather-container');
    
    // Determine weather type
    const weatherType = getWeatherType(current.condition);
    
    container.innerHTML = '';
    container.className = `weather-container ${weatherType}`;
    
    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'current-details';
    detailsDiv.innerHTML = `
        <div class="current-temp">${current.temp_c}°C</div>
        <div class="current-condition">
            <img src="${current.condition.icon}" alt="${current.condition.text}">
            <div>${current.condition.text}</div>
        </div>
        <div class="current-info">
            <p>Feels like: ${current.feelslike_c}°C</p>
            <p>Wind: ${current.wind_kph} km/h ${current.wind_dir}</p>
            <p>Humidity: ${current.humidity}%</p>
        </div>
    `;
    
    container.appendChild(detailsDiv);
    
    // Add weather animation
    createWeatherAnimation(weatherType, container);
}

// Function to display forecast
function displayForecast(forecastDays) {
    const container = document.getElementById('forecast-container');
    container.innerHTML = '';
    
    forecastDays.forEach(day => {
        const date = new Date(day.date);
        const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
        
        // Determine weather type
        const weatherType = getWeatherType(day.day.condition);
        
        const forecastCard = document.createElement('div');
        forecastCard.className = `forecast-card ${weatherType}`;
        forecastCard.innerHTML = `
            <div class="forecast-date">${formattedDate}</div>
            <img src="${day.day.condition.icon}" alt="${day.day.condition.text}">
            <div class="forecast-temp">${day.day.avgtemp_c}°C</div>
            <div>${day.day.condition.text}</div>
            <p>Min: ${day.day.mintemp_c}°C | Max: ${day.day.maxtemp_c}°C</p>
            <p>Chance of rain: ${day.day.daily_chance_of_rain}%</p>
        `;
        
        container.appendChild(forecastCard);
        
        // Add weather animation
        createWeatherAnimation(weatherType, forecastCard);
    });
}

// Load weather data when the page loads
document.addEventListener('DOMContentLoaded', fetchWeatherData);
