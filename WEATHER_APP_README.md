# Flask Weather App

A modern weather application built with Flask that displays current weather and 5-day forecast for any city worldwide.

## Features

✅ **Current Weather Display**
- Temperature, feels-like temperature
- Weather description with icons
- Humidity, wind speed, pressure, cloudiness

✅ **5-Day Forecast**
- Daily min/max temperatures
- Weather conditions with icons
- Humidity and wind speed for each day

✅ **Modern UI**
- Responsive Bootstrap 5 design
- Beautiful gradient backgrounds
- Smooth animations and transitions
- Mobile-friendly layout

✅ **Error Handling**
- Graceful error messages for invalid cities
- Network error handling with user-friendly feedback
- API key validation

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Get OpenWeatherMap API Key

1. Visit [OpenWeatherMap API](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to "API keys" section in your account dashboard
4. Copy your API key

### 3. Configure Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` and paste your OpenWeatherMap API key:

```
OPENWEATHER_API_KEY=your_actual_api_key_here
```

### 4. Run the Application

```bash
python3 FlaskWeatherApp.py
```

The app will start on `http://localhost:5000`

## Usage

1. Open your browser and go to `http://localhost:5000`
2. Enter a city name (e.g., "London", "New York", "Tokyo")
3. Click "Search" or press Enter
4. View current weather and 5-day forecast

## Project Structure

```
/Users/parkerwright/Python/
├── FlaskWeatherApp.py          # Main Flask application
├── requirements.txt             # Python dependencies
├── .env.example                # Environment variable template
├── .env                        # Environment variables (create this)
└── static/weather/
    ├── index.html              # HTML template
    ├── style.css               # Custom CSS styling
    └── script.js               # Frontend JavaScript
```

## API Endpoint

### POST `/api/weather`

**Request:**
```json
{
  "city": "London"
}
```

**Response (Success):**
```json
{
  "success": true,
  "current": {
    "city": "London",
    "country": "GB",
    "temperature": 15,
    "feels_like": 14,
    "description": "Cloudy",
    "icon": "04d",
    "humidity": 72,
    "wind_speed": 3.5,
    "pressure": 1013,
    "cloudiness": 90
  },
  "forecast": [
    {
      "date": "2024-03-19",
      "temp_max": 16,
      "temp_min": 12,
      "description": "Cloudy",
      "icon": "04d",
      "humidity": 75,
      "wind_speed": 4.2
    },
    ...
  ]
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "City 'InvalidCity' not found"
}
```

## Temperature Units

The app displays temperatures in **Celsius (°C)** and wind speeds in **m/s** (meters per second).

## Troubleshooting

### "API key not configured" Error

Make sure you have:
1. Created a `.env` file (copy from `.env.example`)
2. Added your OpenWeatherMap API key to the `.env` file
3. Restarted the Flask application

### "City not found" Error

- Double-check the spelling of the city name
- Try using the country code (e.g., "London, GB" or "New York, US")
- OpenWeatherMap accepts most major cities worldwide

### Connection Errors

- Verify your internet connection
- OpenWeatherMap API must be accessible
- Check if your firewall is blocking the API

## Future Enhancements

- [ ] Toggle between Celsius and Fahrenheit
- [ ] Search history / recent cities
- [ ] Geolocation-based weather
- [ ] Hourly forecast
- [ ] Multiple city comparison
- [ ] Weather alerts/notifications
- [ ] Dark/light theme toggle

## Dependencies

- **Flask** - Web framework
- **requests** - HTTP library for API calls
- **python-dotenv** - Environment variable management
- **Bootstrap 5** - Frontend framework (CDN)

## License

This project is free to use and modify.

## Support

For issues with the OpenWeatherMap API, visit their [documentation](https://openweathermap.org/api).
