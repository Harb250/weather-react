import { useEffect, useState } from 'react';
import { loadWeather } from './api/openMeteo.js';
import { UnitsContext, formatTemp } from './context/UnitsContext.js';
import Header from './components/Header.jsx';
import SearchBar from './components/SearchBar.jsx';
import Suggestions from './components/Suggestions.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import ErrorMessage from './components/ErrorMessage.jsx';
import WeatherCard from './components/WeatherCard.jsx';
import Forecast from './components/Forecast.jsx';

const LAST_CITY_KEY = 'weather:last-city';
const QUICK_PICKS = ['Beirut', 'Tokyo', 'London', 'New York'];

// Start city: ?city=Tokyo in the URL wins, otherwise the last city searched.
function readStartCity() {
  const fromUrl = new URLSearchParams(window.location.search).get('city');
  if (fromUrl) return fromUrl.trim();
  try {
    return localStorage.getItem(LAST_CITY_KEY) ?? '';
  } catch {
    return '';
  }
}

const START_CITY = readStartCity();

export default function App() {
  const [query, setQuery] = useState(START_CITY);     // text in the search box
  const [city, setCity] = useState(START_CITY);       // city we are showing
  const [attempt, setAttempt] = useState(0);          // bumps to force a re-fetch (retry, same city)
  const [weather, setWeather] = useState(null);
  // 'idle' | 'loading' | 'success' | 'error' (start in loading if we already have a city)
  const [status, setStatus] = useState(START_CITY ? 'loading' : 'idle');
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('C');

  // Fetch whenever the city changes (or the user retries).
  useEffect(() => {
    if (!city) return;
    const controller = new AbortController();

    async function load() {
      setStatus('loading');
      setError(null);
      try {
        const data = await loadWeather(city, controller.signal);
        setWeather(data);
        setStatus('success');
      } catch (err) {
        if (controller.signal.aborted) return; // a newer search replaced this one
        setError(err);
        setStatus('error');
      }
    }

    load();
    // Cleanup: cancel the request if the city changes again or the app unmounts.
    return () => controller.abort();
  }, [city, attempt]);

  // Remember the last city that loaded successfully.
  useEffect(() => {
    if (status !== 'success') return;
    try {
      localStorage.setItem(LAST_CITY_KEY, weather.place.name);
    } catch {
      // storage blocked (private mode): not worth bothering the user
    }
  }, [status, weather]);

  // Show the temperature in the browser tab.
  useEffect(() => {
    document.title = status === 'success'
      ? `${formatTemp(weather.current.temp, unit)}${unit} · ${weather.place.name}`
      : 'Weather Dashboard · React';
  }, [status, weather, unit]);

  function search(name) {
    setQuery(name);
    setCity(name);
    setAttempt((a) => a + 1); // re-fetch even if it is the same city
  }

  const loading = status === 'loading';

  return (
    <UnitsContext.Provider value={{ unit, setUnit }}>
      <div className="page">
        <Header />

        <main>
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            onSearch={search}
            disabled={loading}
          />
          <Suggestions cities={QUICK_PICKS} onPick={search} disabled={loading} />

          {status === 'idle' && (
            <p className="status" data-state="idle">Search for a city to see its weather.</p>
          )}
          {loading && <LoadingSpinner city={city} />}
          {status === 'error' && (
            <ErrorMessage error={error} city={city} onRetry={() => setAttempt((a) => a + 1)} />
          )}

          {weather && (status === 'success' || loading) && (
            <section className={loading ? 'result is-stale' : 'result'} aria-label="Weather results">
              <WeatherCard place={weather.place} current={weather.current} today={weather.daily[0]} />
              <Forecast days={weather.daily} />
            </section>
          )}
        </main>

        <footer className="site-footer">
          Data: Open-Meteo · Built with React, useState + useEffect
        </footer>
      </div>
    </UnitsContext.Provider>
  );
}
