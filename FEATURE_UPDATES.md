# Weather App - Feature Updates

## Summary
Three new features have been proposed and added as GitHub issues for the Flask Weather App project. These enhancements will improve user experience and add commonly requested functionality.

---

## Feature #1: Toggle Temperature Units (Celsius/Fahrenheit)
**GitHub Issue:** #1  
**Priority:** High  
**Status:** Open

### Description
Add a button or toggle switch to allow users to switch between Celsius and Fahrenheit temperature display without reloading the page.

### What's New
- Toggle button in the UI (top right or near search bar)
- Currently displays both "°C / °F" for all temperatures
- After toggle: Display only the selected unit
- User preference persists using localStorage
- Works for current weather and 5-day forecast
- Smooth transition when switching units

### Implementation Notes
- Store preference in browser localStorage
- Update all temperature displays in real-time
- UI suggestion: Button could say "°F" when in Celsius mode, "°C" when in Fahrenheit mode
- Current API returns Celsius; conversion already exists in code

### Benefits
- Better UI clarity by showing only one unit
- Improved user experience with persistent preferences
- No page reload required

---

## Feature #2: Search History & Recent Cities
**GitHub Issue:** #2  
**Priority:** Medium  
**Status:** Open

### Description
Display a list of recently searched cities for quick access, with ability to click and view weather instantly.

### What's New
- Store last 10 searched cities in localStorage
- Display as dropdown/list below search input or in a sidebar
- Click recent city to show its weather instantly
- "Clear history" button to reset recent searches
- Prevent duplicate entries (if city already searched, move to top)
- Show timestamp of last search for each city
- Mobile-friendly UI for recent cities list

### Implementation Notes
- Use JavaScript localStorage API to persist data
- Data format: `{city: string, timestamp: ISO8601, weather_icon: string}`
- Optional enhancements:
  - Show weather icon next to each city for quick preview
  - Add "favorite" star to pin cities
  - Display count of searches per city

### Benefits
- Faster access to frequently checked cities
- Improved workflow for users who check the same locations regularly
- Better user engagement through convenience

---

## Feature #3: Geolocation-Based Weather Detection
**GitHub Issue:** #3  
**Priority:** Medium  
**Status:** Open

### Description
Auto-detect the user's location using browser geolocation API and display weather for their current city on page load.

### What's New
- Request user's permission to access location (browser permission dialog)
- Use browser's Geolocation API to get latitude/longitude
- Convert coordinates to city name using reverse geocoding
- Auto-load weather on first visit (if user permits)
- "Use My Location" button for manual trigger
- Handle permission denied gracefully (show default message)
- Cache location for session to avoid repeated requests
- Works on both desktop and mobile browsers

### Implementation Notes
- Use OpenWeatherMap reverse geocoding API: `/geo/1.0/reverse?lat={lat}&lon={lon}&limit=1`
- Geolocation API is browser built-in, no new dependencies needed
- User must explicitly grant permission (HTTPS recommended)
- Fallback: If geolocation fails, show search form as normal
- Performance consideration: Be mindful of battery usage on mobile devices

### Benefits
- Seamless first-time user experience
- No need to manually search for current location
- Especially useful for travelers checking weather on-the-go

---

## Implementation Timeline

| Feature | Priority | Estimated Effort | Suggested Order |
|---------|----------|------------------|-----------------|
| Toggle Temperature Units | High | 2-3 hours | 1st |
| Search History & Recent Cities | Medium | 3-4 hours | 2nd |
| Geolocation-Based Weather | Medium | 2-3 hours | 3rd |

---

## How to Get Started

1. Visit the [Python repository on GitHub](https://github.com/parkerrwright-pm/Python)
2. Navigate to the Issues tab to see all three features
3. Click on any issue to view detailed requirements and acceptance criteria
4. Start with Feature #1 (highest priority) or choose based on your interests

## Notes

- All three features use existing browser APIs (localStorage, Geolocation)
- No new backend dependencies required
- All features enhance user experience without breaking existing functionality
- Each feature can be implemented independently

---

*Generated: March 19, 2026*
