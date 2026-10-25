import { useUnits, formatTemp } from '../context/UnitsContext.js';
import WeatherIcon from './WeatherIcon.jsx';
import Stat from './Stat.jsx';

const timeFmt = new Intl.DateTimeFormat('en', {
  weekday: 'long', hour: '2-digit', minute: '2-digit', timeZone: 'UTC',
});

export default function WeatherCard({ place, current, today }) {
  const { unit } = useUnits();
  const t = (celsius) => formatTemp(celsius, unit);

  return (
    <article className="card current">
      <div className="current__place">
        <h2 className="current__city">{place.name}</h2>
        {place.country && <p className="current__country">{place.country}</p>}
        <p className="current__time">Local time · {timeFmt.format(current.localTime)}</p>
      </div>

      <div className="current__main">
        <WeatherIcon className="current__icon" code={current.icon} alt={current.description} size={120} />
        <div>
          <p className="current__temp">{t(current.temp)}</p>
          <p className="current__desc">{current.description}</p>
        </div>
      </div>

      <dl className="stats">
        <Stat label="Feels like" value={t(current.feelsLike)} />
        <Stat label="Humidity" value={`${Math.round(current.humidity)}%`} />
        <Stat label="Wind" value={`${Math.round(current.windKmh)} km/h`} />
        <Stat label="High / Low" value={today ? `${t(today.max)} / ${t(today.min)}` : '—'} />
      </dl>
    </article>
  );
}
