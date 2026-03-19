from flask import Flask, render_template, request, jsonify
import requests
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# Get absolute paths for static and template folders
BASE_DIR = Path(__file__).parent
STATIC_DIR = BASE_DIR / 'static' / 'weather'
TEMPLATE_DIR = BASE_DIR / 'static' / 'weather'

app = Flask(__name__, static_folder=str(STATIC_DIR), static_url_path='', template_folder=str(TEMPLATE_DIR))

# OpenWeatherMap API configuration
OPENWEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY', 'YOUR_API_KEY_HERE')
OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5'

def celsius_to_fahrenheit(celsius):
    """Convert Celsius to Fahrenheit"""
    return round((celsius * 9/5) + 32)

@app.route('/')
def index():
    return render_template('index.html')

@app.post('/api/weather')
def get_weather():
    """
    Fetch current weather and 5-day forecast for a given city.
    Request: {"city": "London"} or {"city": "Los Angeles, California"}
    Response: {
        "success": true,
        "current": {...},
        "forecast": [...]
    }
    """
    try:
        data = request.get_json()
        city_input = data.get('city', '').strip()

        if not city_input:
            return jsonify({'success': False, 'error': 'City name is required'}), 400

        if OPENWEATHER_API_KEY == 'YOUR_API_KEY_HERE':
            return jsonify({'success': False, 'error': 'API key not configured. Set OPENWEATHER_API_KEY environment variable.'}), 500

        # Parse state from input if provided (e.g., "Los Angeles, California")
        state = None
        parts = [p.strip() for p in city_input.split(',')]
        if len(parts) > 1:
            state = parts[1]  # Get state if user provided it

        # Fetch current weather
        current_weather_url = f'{OPENWEATHER_BASE_URL}/weather'
        current_params = {
            'q': city_input,
            'appid': OPENWEATHER_API_KEY,
            'units': 'metric'
        }
        
        current_response = requests.get(current_weather_url, params=current_params, timeout=5)
        
        if current_response.status_code == 404:
            return jsonify({'success': False, 'error': f'City "{city_input}" not found'}), 404
        
        if current_response.status_code != 200:
            return jsonify({'success': False, 'error': 'Failed to fetch weather data'}), 500

        current_data = current_response.json()

        # Fetch 5-day forecast
        forecast_url = f'{OPENWEATHER_BASE_URL}/forecast'
        forecast_params = {
            'q': city_input,
            'appid': OPENWEATHER_API_KEY,
            'units': 'metric'
        }
        
        forecast_response = requests.get(forecast_url, params=forecast_params, timeout=5)
        forecast_data = forecast_response.json() if forecast_response.status_code == 200 else {'list': []}

        # Process forecast to get daily data (one entry per day at noon)
        daily_forecast = {}
        for item in forecast_data.get('list', []):
            dt_txt = item.get('dt_txt', '')
            if '12:00:00' in dt_txt:  # Get noon readings for each day
                date = dt_txt.split(' ')[0]
                temp_max_c = round(item['main']['temp_max'])
                temp_min_c = round(item['main']['temp_min'])
                # Force day icon since we're getting noon data (convert 'n' to 'd')
                icon = item['weather'][0]['icon']
                if icon.endswith('n'):
                    icon = icon[:-1] + 'd'
                daily_forecast[date] = {
                    'date': date,
                    'temp_max_c': temp_max_c,
                    'temp_max_f': celsius_to_fahrenheit(temp_max_c),
                    'temp_min_c': temp_min_c,
                    'temp_min_f': celsius_to_fahrenheit(temp_min_c),
                    'description': item['weather'][0]['main'],
                    'icon': icon,
                    'humidity': item['main']['humidity'],
                    'wind_speed': round(item['wind']['speed'], 1)
                }

        return jsonify({
            'success': True,
            'current': {
                'city': current_data['name'],
                'state': state,
                'country': current_data['sys']['country'],
                'temperature_c': round(current_data['main']['temp']),
                'temperature_f': celsius_to_fahrenheit(current_data['main']['temp']),
                'feels_like_c': round(current_data['main']['feels_like']),
                'feels_like_f': celsius_to_fahrenheit(current_data['main']['feels_like']),
                'description': current_data['weather'][0]['main'],
                'icon': current_data['weather'][0]['icon'],
                'humidity': current_data['main']['humidity'],
                'wind_speed': round(current_data['wind']['speed'], 1),
                'pressure': current_data['main']['pressure'],
                'cloudiness': current_data['clouds']['all']
            },
            'forecast': list(daily_forecast.values())[:5]  # Limit to 5 days
        }), 200

    except requests.exceptions.Timeout:
        return jsonify({'success': False, 'error': 'Request timed out. Try again.'}), 500
    except requests.exceptions.ConnectionError:
        return jsonify({'success': False, 'error': 'Network error. Check your connection.'}), 500
    except Exception as e:
        return jsonify({'success': False, 'error': f'An error occurred: {str(e)}'}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
